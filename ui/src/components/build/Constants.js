/* clientType */
export const CLIENT_TYPE_ANDROID = 'android';
export const CLIENT_TYPE_IOS = 'ios';
export const CLIENT_TYPE_CORDOVA = 'cordova';
export const CLIENT_TYPE_XAMARIN = 'xamarin';

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

export const KEY_HIDE_PLATFORM = 'hidePlatform';
export const KEY_EXTERNAL_CREDENTIALS = 'externalCredentials';
export const KEY_ALL_MANDATORY = 'allMandatoryFilled';
export const KEY_ALL_VALID = 'allValid';
export const KEY_UI = 'ui';

/* Path generation functions */
export const ofValidation = path => withPath('validation', path);
export const withPath = (prePath, path) => `${prePath}.${path}`;

/** BuildConfigCreateRequest keys */
export const KEY_CR = 'config';
export const KEY_CR_NAME = 'name';
export const KEY_CR_CLIENT_ID = 'clientId';
export const KEY_CR_CLIENT_TYPE = 'clientType';
export const KEY_CR_SOURCE = 'source';
export const PATH_CR_SOURCE = withPath(KEY_CR, KEY_CR_SOURCE);
export const KEY_CR_BUILD = 'build';
export const PATH_CR_BUILD = withPath(KEY_CR, KEY_CR_BUILD);

export const KEY_CR_ENV_VARS = `envVars`;
export const KEY_CR_BUILD_PLATFORM = 'platform';
export const KEY_CR_BUILD_TYPE = 'buildType';

export const KEY_CR_BUILD_IOS_CREDENTIALS = `iosCredentials`;
export const PATH_CR_BUILD_IOS_CREDENTIALS = withPath(PATH_CR_BUILD, KEY_CR_BUILD_IOS_CREDENTIALS);
export const KEY_CR_BUILD_IOS_CREDENTIALS_NAME = 'name';
export const KEY_CR_BUILD_IOS_CREDENTIALS_DEVELOPER_PROFILE = 'developerProfile';
export const KEY_CR_BUILD_IOS_CREDENTIALS_PROFILE_PASSWORD = 'profilePassword';

export const KEY_CR_BUILD_ANDROID_CREDENTIALS = 'androidCredentials';
export const PATH_CR_BUILD_ANDROID_CREDENTIALS = withPath(PATH_CR_BUILD, KEY_CR_BUILD_ANDROID_CREDENTIALS);
export const KEY_CR_BUILD_ANDROID_CREDENTIALS_NAME = 'name';
export const KEY_CR_BUILD_ANDROID_CREDENTIALS_KEYSTORE = 'keystore';
export const KEY_CR_BUILD_ANDROID_CREDENTIALS_KEYSTORE_PASSWORD = 'keystorePassword';
export const KEY_CR_BUILD_ANDROID_CREDENTIALS_KEYSTORE_ALIAS = 'keystoreAlias';

export const KEY_CR_SOURCE_GITURL = 'gitUrl';
export const KEY_CR_SOURCE_GITREF = 'gitRef';
export const KEY_CR_SOURCE_JENKINS_FILE_PATH = 'jenkinsFilePath';
export const KEY_CR_SOURCE_AUTH_TYPE = 'authType';

export const KEY_CR_SOURCE_BASIC_AUTH = `basicAuth`;
export const PATH_CR_SOURCE_BASIC_AUTH = withPath(PATH_CR_SOURCE, KEY_CR_SOURCE_BASIC_AUTH);
export const KEY_CR_BASIC_AUTH_NAME = 'name';
export const KEY_CR_BASIC_AUTH_USERNAME = 'username';
export const KEY_CR_BASIC_AUTH_PASSWORD = 'password';

export const KEY_CR_SOURCE_SSH_AUTH = 'sshAuth';
export const PATH_CR_SOURCE_SSH_AUTH = withPath(PATH_CR_SOURCE, KEY_CR_SOURCE_SSH_AUTH);
export const KEY_CR_SSH_AUTH_NAME = 'name';
export const KEY_CR_SSH_PRIVATE_KEY = 'privateKey';
