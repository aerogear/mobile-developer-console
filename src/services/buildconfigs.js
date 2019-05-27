import { create, getNamespace, getMasterUri, get, update, remove } from './openshift';
import { buildsDef, buildConfigsDef, buildConfigInstantiateDef, secretsDef } from '../models/k8s/definitions';

function getRequiredSecrets(config) {
  const secretsToCreate = [];
  if (config && config.source && config.source.basicAuth) {
    const basicAuthSecret = {
      kind: 'Secret',
      type: 'Opaque',
      metadata: {
        name: config.source.basicAuth.name,
        labels: {
          'mobile-client-build': 'true',
          'mobile-client-id': config.clientId
        }
      },
      stringData: {
        username: config.source.basicAuth.username,
        password: config.source.basicAuth.password
      }
    };
    secretsToCreate.push(basicAuthSecret);
  } else if (config && config.source && config.source.sshAuth) {
    const sshSecret = {
      kind: 'Secret',
      type: 'kubernetes.io/ssh-auth',
      metadata: {
        name: config.source.sshAuth.name,
        labels: {
          'mobile-client-build': 'true',
          'mobile-client-id': config.clientId
        }
      },
      stringData: {
        'ssh-privatekey': config.source.sshAuth.privateKey
      }
    };
    secretsToCreate.push(sshSecret);
  }
  if (config && config.build && config.build.iosCredentials) {
    const iosSecret = {
      kind: 'Secret',
      type: 'Opaque',
      metadata: {
        name: config.build.iosCredentials.name,
        labels: {
          'mobile-client-build': 'true',
          'credential.sync.jenkins.openshift.io': 'true',
          'mobile-client-id': config.clientId
        }
      },
      data: {
        'developer-profile': config.build.iosCredentials.developerProfile,
        password: config.build.iosCredentials.profilePassword
      }
    };
    secretsToCreate.push(iosSecret);
  }
  if (config && config.build && config.build.androidCredentials) {
    const androidSecret = {
      kind: 'Secret',
      type: 'Opaque',
      metadata: {
        name: config.build.androidCredentials.name,
        labels: {
          'mobile-client-build': 'true',
          'credential.sync.jenkins.openshift.io': 'true',
          'mobile-client-id': config.clientId
        }
      },
      data: {
        certificate: config.build.androidCredentials.keystore,
        password: config.build.iosCredentials.keystorePassword
      }
    };
    secretsToCreate.push(androidSecret);
  }
  return secretsToCreate;
}

function getSourceConfig(config) {
  const source = {
    type: 'git',
    git: {
      uri: config.source.gitUrl,
      ref: config.source.gitRef
    }
  };
  if (config && config.source && config.source.basicAuth) {
    source.sourceSecret = { name: config.source.basicAuth.name };
  } else if (config && config.source && config.source.sshAuth) {
    source.sourceSecret = { name: config.source.sshAuth.name };
  }
  return source;
}

function getJenkinsConfig(config) {
  const jenkinsConfig = {
    type: 'JenkinsPipeline',
    jenkinsPipelineStrategy: {
      jenkinsfilePath: config.source.jenkinsFilePath,
      env: [
        ...(config.envVars || []),
        { name: 'BUILD_CONFIG', value: config.build.buildType },
        { name: 'PLATFORM', value: config.build.platform }
      ]
    }
  };
  if (config && config.build && config.build.iosCredentials) {
    jenkinsConfig.jenkinsPipelineStrategy.env.push({
      name: 'BUILD_CREDENTIAL_ID',
      value: config.build.iosCredentials.name
    });
  }
  if (config && config.build && config.build.androidCredentials) {
    jenkinsConfig.jenkinsPipelineStrategy.env.push(
      { name: 'BUILD_CREDENTIAL_ID', value: config.build.androidCredentials.name },
      { name: 'BUILD_CREDENTIAL_ALIAS', value: config.build.androidCredentials.keystoreAlias }
    );
  }
  return jenkinsConfig;
}

class BuildConfigsService {
  constructor() {
    this.namespace = getNamespace();
    this.buildRes = buildsDef(this.namespace);
    this.buildConfigsRes = buildConfigsDef(this.namespace);
    this.buildConfigInstantiateRes = buildConfigInstantiateDef(this.namespace);
    this.secretsRes = secretsDef(this.namespace);
  }

  trigger(name) {
    const res = this.buildConfigInstantiateRes(name);
    const req = {
      kind: 'BuildRequest',
      apiVersion: 'build.openshift.io/v1',
      metadata: {
        name,
        namespace: this.namespace
      }
    };
    return create(res, req);
  }

  addBuildUrl(build) {
    const buildConfigName = build.status.config.name;
    const buildName = build.metadata.name;
    build.buildUrl = `${getMasterUri()}/console/project/${
      this.namespace
    }/browse/pipelines/${buildConfigName}/${buildName}`;
    return build;
  }

  generateDownloadURL(name) {
    return get(this.buildRes, name)
      .then(build => {
        build.metadata.annotations['aerogear.org/download-mobile-artifact'] = 'true';
        return build;
      })
      .then(build => update(this.buildRes, build));
  }

  deleteBuildConfig(name) {
    return remove(this.buildConfigsRes, { metadata: { name } });
  }

  createBuildConfig(config) {
    const secretsToCreate = getRequiredSecrets(config);
    const buildConfig = {
      metadata: {
        name: config.name,
        namespace: this.namespace,
        labels: {
          'mobile-client-build': 'true',
          'mobile-client-build-platform': config.build.platform,
          'mobile-client-id': config.clientId
        }
      },
      spec: {
        source: getSourceConfig(config),
        strategy: getJenkinsConfig(config)
      }
    };
    const secretsCreates = secretsToCreate.map(secret => create(this.secretsRes, secret));
    return create(this.buildConfigsRes, buildConfig).then(() => Promise.all(secretsCreates));
  }
}

const buildConfigsService = new BuildConfigsService();
export { buildConfigsService, BuildConfigsService };
