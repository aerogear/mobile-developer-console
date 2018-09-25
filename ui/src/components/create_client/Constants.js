/* keys for mobile client create request */
export const CREATE_CLIENT_NAME = 'name';
export const CREATE_CLIENT_TYPE = 'clientType';
export const CREATE_CLIENT_APP_ID = 'appIdentifier';

/* platform constants for clientType */
export const PLATFORM_ANDROID = 'android';
export const PLATFORM_IOS = 'iOS';
export const PLATFORM_CORDOVA = 'cordova';
export const PLATFORM_XAMARIN = 'xamarin';

export const CLIENT_CONFIGURATION = 'clientConfiguration';

/* WIZARD STEPS */
export const WIZARD_SELECT_PLATFORM = 0;
export const WIZARD_CONFIGURE_CLIENT = 1;
export const WIZARD_CREATION_RESULT = 2;

export const CREATE_CLIENT_API_PATH = '/api/mobileclients';
