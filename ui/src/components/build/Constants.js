/* SourceConfig authType */
export const BUILD_AUTH_TYPE_BASIC = 'basic';
export const BUILD_AUTH_TYPE_PUBLIC = 'public';
export const BUILD_AUTH_TYPE_SSH = 'ssh';

/* BuildConfig platform */
export const BUILD_PLATFORM_ANDROID = 'android';
export const BUILD_PLATFORM_IOS = 'iOS';

/* BuildConfig buildType */
export const BUILD_TYPE_DEBUG = 'debug';
export const BUILD_TYPE_RELEASE = 'release';

export const KEY_ADVANCED_OPTIONS = 'advancedOptions';

/** BuildConfigCreateRequest keys */
export const KEY_CR_NAME = 'name';
export const KEY_CR_CLIENT_ID = 'clientId';
export const KEY_CR_CLIENT_TYPE = 'clientType';
export const KEY_CR_SOURCE = 'source';
export const KEY_CR_BUILD = 'build';
export const KEY_CR_ENV_VARS = 'envVars';

export const KEY_CR_BUILD_PLATFORM = 'platform';
export const KEY_CR_BUILD_TYPE = 'buildType';
export const KEY_CR_BUILD_ANDROID_CREDENTIALS = 'androidCredentials';
export const KEY_CR_BUILD_IOS_CREDENTIALS = 'iosCredentials';

export const KEY_CR_BUILD_IOS_CREDENTIALS_NAME = 'name';
export const KEY_CR_BUILD_IOS_CREDENTIALS_DEVELOPER_PROFILE = 'developerProfile';
export const KEY_CR_BUILD_IOS_CREDENTIALS_PROFILE_PASSWORD = 'profilePassword';

export const KEY_CR_BUILD_ANDROID_CREDENTIALS_NAME = 'name';
export const KEY_CR_BUILD_ANDROID_CREDENTIALS_KEYSTORE = 'developerProfile';
export const KEY_CR_BUILD_ANDROID_CREDENTIALS_KEYSTORE_PASSWORD = 'keystorePassword';
export const KEY_CR_BUILD_ANDROID_CREDENTIALS_KEYSTORE_ALIAS = 'keystoreAlias';

export const KEY_CR_SOURCE_GITURL = 'gitUrl';
export const KEY_CR_SOURCE_GITREF = 'gitRef';
export const KEY_CR_SOURCE_JENKINS_FILE_PATH = 'jenkinsFilePath';
export const KEY_CR_SOURCE_AUTH_TYPE = 'authType';
export const KEY_CR_SOURCE_BASIC_AUTH = 'basicAuth';
export const KEY_CR_SOURCE_SSH_AUTH = 'sshAuth';

export const KEY_CR_BASIC_AUTH_NAME = 'name';
export const KEY_CR_BASIC_AUTH_USERNAME = 'username';
export const KEY_CR_BASIC_AUTH_PASSWORD = 'password';

export const KEY_CR_SSH_AUTH_NAME = 'name';
export const KEY_CR_SSH_PRIVATE_KEY = 'privateKey';
