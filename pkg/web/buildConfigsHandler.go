package web

import (
	"errors"
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

func addBasicAuthConfig(config *mobile.BuildConfig, secrets []v1.Secret, data BuildConfigCreateRequest) (*mobile.BuildConfig, []v1.Secret) {
	config.Spec.CommonSpec.Source.SourceSecret = &corev1.LocalObjectReference{
		Name: data.Source.BasicAuth.Name,
	}
	secrets = append(secrets, v1.Secret{
		Type: "Opaque",
		ObjectMeta: metav1.ObjectMeta{
			Name: data.Source.BasicAuth.Name,
			Labels: map[string]string{
				"mobile-client-build": "true",
			},
		},
		StringData: map[string]string{
			"username": data.Source.BasicAuth.Username,
			"password": data.Source.BasicAuth.Password,
		},
	})
	return config, secrets
}

func addSSHAuthConfig(config *mobile.BuildConfig, secrets []v1.Secret, data BuildConfigCreateRequest) (*mobile.BuildConfig, []v1.Secret) {
	config.Spec.CommonSpec.Source.SourceSecret = &corev1.LocalObjectReference{
		Name: data.Source.SSHAuth.Name,
	}
	secrets = append(secrets, v1.Secret{
		Type: "kubernetes.io/ssh-auth",
		ObjectMeta: metav1.ObjectMeta{
			Name: data.Source.SSHAuth.Name,
			Labels: map[string]string{
				"mobile-client-build": "true",
			},
		},
		StringData: map[string]string{
			"ssh-privatekey": data.Source.SSHAuth.PrivateKey,
		},
	})
	return config, secrets
}

func addAuthConfig(config *mobile.BuildConfig, secrets []v1.Secret, data BuildConfigCreateRequest) (*mobile.BuildConfig, []v1.Secret, error) {
	if data.Source.AuthType == "public" {
		return config, secrets, nil
	}
	switch data.Source.AuthType {
	case "basic":
		if data.Source.BasicAuth == nil {
			return nil, nil, errors.New("Configuration for basic auth type required")
		}
		config, secrets = addBasicAuthConfig(config, secrets, data)
	case "ssh":
		if data.Source.SSHAuth == nil {
			return nil, nil, errors.New("Configuration for SSH auth type required")
		}
		config, secrets = addSSHAuthConfig(config, secrets, data)
	}
	return config, secrets, nil
}

func addIOSBuildConfig(config *mobile.BuildConfig, secrets []v1.Secret, data BuildConfigCreateRequest) (*mobile.BuildConfig, []v1.Secret) {
	config.Spec.Strategy.JenkinsPipelineStrategy.Env = append(
		config.Spec.Strategy.JenkinsPipelineStrategy.Env,
		corev1.EnvVar{Name: "BUILD_CREDENTIAL_ID", Value: data.Build.IOSCredentials.Name},
	)
	profile, _ := base64.StdEncoding.DecodeString(data.Build.IOSCredentials.DeveloperProfile)
	pass, _ := base64.StdEncoding.DecodeString(data.Build.IOSCredentials.ProfilePassword)
	secrets = append(secrets, v1.Secret{
		Type: "Opaque",
		ObjectMeta: metav1.ObjectMeta{
			Name: data.Build.IOSCredentials.Name,
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
	return config, secrets
}

func addAndroidBuildConfig(config *mobile.BuildConfig, secrets []v1.Secret, data BuildConfigCreateRequest) (*mobile.BuildConfig, []v1.Secret) {
	config.Spec.Strategy.JenkinsPipelineStrategy.Env = append(
		config.Spec.Strategy.JenkinsPipelineStrategy.Env,
		corev1.EnvVar{Name: "BUILD_CREDENTIAL_ID", Value: data.Build.AndroidCredentials.Name},
		corev1.EnvVar{Name: "BUILD_CREDENTIAL_ALIAS", Value: data.Build.AndroidCredentials.KeystoreAlias},
	)
	cer, _ := base64.StdEncoding.DecodeString(data.Build.AndroidCredentials.Keystore)
	pass, _ := base64.StdEncoding.DecodeString(data.Build.AndroidCredentials.KeystorePassword)
	secrets = append(secrets, v1.Secret{
		Type: "Opaque",
		ObjectMeta: metav1.ObjectMeta{
			Name: data.Build.AndroidCredentials.Name,
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
	return config, secrets
}

func addBuildConfig(config *mobile.BuildConfig, secrets []v1.Secret, data BuildConfigCreateRequest) (*mobile.BuildConfig, []v1.Secret, error) {
	config.Spec.Strategy.JenkinsPipelineStrategy.Env = []corev1.EnvVar{
		corev1.EnvVar{Name: "BUILD_CONFIG", Value: data.Build.BuildType},
		corev1.EnvVar{Name: "PLATFORM", Value: data.Build.Platform},
	}
	if data.Build.Platform == "iOS" {
		if data.Build.IOSCredentials == nil {
			return nil, nil, errors.New("Configuration for iOS credentials required")
		}
		config, secrets = addIOSBuildConfig(config, secrets, data)
	}
	if data.Build.Platform == "android" && data.Build.BuildType == "release" && data.Build.AndroidCredentials != nil {
		config, secrets = addAndroidBuildConfig(config, secrets, data)
	}
	config.Spec.Strategy.JenkinsPipelineStrategy.Env = append(
		config.Spec.Strategy.JenkinsPipelineStrategy.Env,
		data.EnvironmentVariables...,
	)
	return config, secrets, nil
}

func newBuildConfigObject(data BuildConfigCreateRequest, namespace string) (*mobile.BuildConfig, []v1.Secret, error) {
	config := &mobile.BuildConfig{
		ObjectMeta: metav1.ObjectMeta{
			Name:      data.Name,
			Namespace: namespace,
			Labels: map[string]string{
				"mobile-client-build":          "true",
				"mobile-client-build-platform": data.Build.Platform,
				"mobile-client-id":             data.ClientID,
				"mobile-client-type":           data.ClientType,
			},
		},
		Spec: buildV1.BuildConfigSpec{
			CommonSpec: buildV1.CommonSpec{
				Source: buildV1.BuildSource{
					Type: "Git",
					Git: &buildV1.GitBuildSource{
						URI: data.Source.GitURL,
						Ref: data.Source.GitRef,
					},
				},
				Strategy: buildV1.BuildStrategy{
					Type: "JenkinsPipeline",
					JenkinsPipelineStrategy: &buildV1.JenkinsPipelineBuildStrategy{
						JenkinsfilePath: data.Source.JenkinsFilePath,
					},
				},
			},
		},
	}

	var secrets []v1.Secret
	config, secrets, err := addAuthConfig(config, secrets, data)
	if err != nil {
		return nil, nil, err
	}
	return addBuildConfig(config, secrets, data)
}

func (mbch *MobileBuildConfigsHandler) Create(c echo.Context) error {
	reqData := new(BuildConfigCreateRequest)
	if err := c.Bind(reqData); err != nil {
		return err
	}
	if err := c.Validate(reqData); err != nil {
		return err
	}
	config, secrets, err := newBuildConfigObject(*reqData, mbch.namespace)
	if err != nil {
		return err
	}
	config, err = mbch.buildConfigsCRUDL.Create(config)
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
