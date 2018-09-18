package web

import (
	"net/http"

	"encoding/base64"

	"github.com/aerogear/mobile-client-service/pkg/mobile"
	"github.com/labstack/echo"
	buildV1 "github.com/openshift/api/build/v1"
	"k8s.io/api/core/v1"
	corev1 "k8s.io/api/core/v1"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
)

type MobileBuildConfigsHandler struct {
	namespace         string
	buildConfigsCRUDL mobile.BuildConfigCRUDL
	secretsCRUDL      mobile.SecretsCRUDL
}

func NewMobileBuildConfigsHandler(buildConfigsCRUDL mobile.BuildConfigCRUDL, secretsCRUDL mobile.SecretsCRUDL, namespace string) *MobileBuildConfigsHandler {
	return &MobileBuildConfigsHandler{
		buildConfigsCRUDL: buildConfigsCRUDL,
		secretsCRUDL:      secretsCRUDL,
		namespace:         namespace,
	}
}

func newBuildConfigObject(data BuildConfigCreateRequest, namespace string) (*mobile.BuildConfig, []v1.Secret) {
	env := []corev1.EnvVar{
		corev1.EnvVar{Name: "BUILD_CONFIG", Value: data.BuildType},
		corev1.EnvVar{Name: "PLATFORM", Value: data.Platform},
	}
	if data.CredentialsName != "" {
		env = append(env, corev1.EnvVar{Name: "BUILD_CREDENTIAL_ID", Value: data.CredentialsName})
	}
	if data.AndroidKeystoreAlias != "" {
		env = append(env, corev1.EnvVar{Name: "BUILD_CREDENTIAL_ALIAS", Value: data.AndroidKeystoreAlias})
	}
	env = append(env, data.EnvironmentVariables...)
	config := &mobile.BuildConfig{
		ObjectMeta: metav1.ObjectMeta{
			Name:      data.Name,
			Namespace: namespace,
			Labels: map[string]string{
				"mobile-client-build":          "true",
				"mobile-client-build-platform": data.Platform,
				"mobile-client-id":             data.MobileClientID,
				"mobile-client-type":           data.MobileClientType,
			},
		},
		Spec: buildV1.BuildConfigSpec{
			CommonSpec: buildV1.CommonSpec{
				Source: buildV1.BuildSource{
					Type: "Git",
					Git: &buildV1.GitBuildSource{
						URI: data.GitURL,
						Ref: data.GitRef,
					},
				},
				Strategy: buildV1.BuildStrategy{
					Type: "JenkinsPipeline",
					JenkinsPipelineStrategy: &buildV1.JenkinsPipelineBuildStrategy{
						JenkinsfilePath: data.JenkinsFilePath,
						Env:             env,
					},
				},
			},
		},
	}
	if data.AuthName != "" {
		config.Spec.CommonSpec.Source.SourceSecret = &corev1.LocalObjectReference{
			Name: data.AuthName,
		}
	}
	var secrets []v1.Secret
	switch data.AuthType {
	case "basic":
		secrets = append(secrets, v1.Secret{
			Type: "Opaque",
			ObjectMeta: metav1.ObjectMeta{
				Name: data.AuthName,
				Labels: map[string]string{
					"mobile-client-build": "true",
				},
			},
			StringData: map[string]string{
				"username": data.AuthUsername,
				"password": data.AuthPassword,
			},
		})
	case "ssh":
		secrets = append(secrets, v1.Secret{
			Type: "kubernetes.io/ssh-auth",
			ObjectMeta: metav1.ObjectMeta{
				Name: data.AuthName,
				Labels: map[string]string{
					"mobile-client-build": "true",
				},
			},
			StringData: map[string]string{
				"ssh-privatekey": data.AuthPrivateKey,
			},
		})
	}
	if data.Platform == "iOS" {
		profile, _ := base64.StdEncoding.DecodeString(data.IOSDeveloperProfile)
		pass, _ := base64.StdEncoding.DecodeString(data.IOSProfilePassword)
		secrets = append(secrets, v1.Secret{
			Type: "Opaque",
			ObjectMeta: metav1.ObjectMeta{
				Name: data.AuthName,
				Labels: map[string]string{
					"mobile-client-build":                  "true",
					"credential.sync.jenkins.openshift.io": "true",
				},
			},
			Data: map[string][]byte{
				"developer-profile": profile,
				"password":          pass,
			},
		})
	}
	if data.Platform == "android" && data.BuildType == "release" {
		cer, _ := base64.StdEncoding.DecodeString(data.AndroidKeystore)
		pass, _ := base64.StdEncoding.DecodeString(data.AndroidKeystorePassword)
		secrets = append(secrets, v1.Secret{
			Type: "Opaque",
			ObjectMeta: metav1.ObjectMeta{
				Name: data.AuthName,
				Labels: map[string]string{
					"mobile-client-build":                  "true",
					"credential.sync.jenkins.openshift.io": "true",
				},
			},
			Data: map[string][]byte{
				"certificate": cer,
				"password":    pass,
			},
		})
	}
	return config, secrets
}

func (mbch *MobileBuildConfigsHandler) Create(c echo.Context) error {
	reqData := new(BuildConfigCreateRequest)
	if err := c.Bind(reqData); err != nil {
		return err
	}
	if err := c.Validate(reqData); err != nil {
		return err
	}
	config, secrets := newBuildConfigObject(*reqData, mbch.namespace)
	config, err := mbch.buildConfigsCRUDL.Create(config)
	if err != nil {
		return err
	}
	for _, element := range secrets {
		_, err := mbch.secretsCRUDL.Create(mbch.namespace, &element)
		if err != nil {
			return err
		}
	}
	return c.JSON(http.StatusOK, config)
}

func (mbch *MobileBuildConfigsHandler) List(c echo.Context) error {
	buildConfigs, err := mbch.buildConfigsCRUDL.List(mbch.namespace)
	if err != nil {
		c.Logger().Errorf("error listing build configs %v", err)
		return c.NoContent(http.StatusInternalServerError)
	}
	return c.JSON(http.StatusOK, buildConfigs)
}

func (mbch *MobileBuildConfigsHandler) Instantiate(c echo.Context) error {
	name := c.Param("name")
	build, err := mbch.buildConfigsCRUDL.Instantiate(mbch.namespace, name)
	if err != nil {
		return err
	}
	return c.JSON(http.StatusOK, build)
}
