import { has } from 'lodash-es';
import {
  KEY_CR_NAME,
  KEY_CR_SOURCE_GITURL,
  KEY_CR_SOURCE_GITREF,
  KEY_CR_SOURCE_JENKINS_FILE_PATH,
  KEY_CR_BASIC_AUTH_NAME,
  KEY_CR_BASIC_AUTH_PASSWORD,
  KEY_CR_BASIC_AUTH_USERNAME,
  KEY_CR_SSH_AUTH_NAME,
  KEY_CR_SSH_PRIVATE_KEY,
  KEY_CR_BUILD_ANDROID_CREDENTIALS_NAME,
  KEY_CR_BUILD_ANDROID_CREDENTIALS_KEYSTORE,
  KEY_CR_BUILD_ANDROID_CREDENTIALS_KEYSTORE_ALIAS,
  KEY_CR_BUILD_ANDROID_CREDENTIALS_KEYSTORE_PASSWORD,
  KEY_CR_BUILD_IOS_CREDENTIALS_NAME,
  KEY_CR_BUILD_IOS_CREDENTIALS_DEVELOPER_PROFILE,
  KEY_CR_BUILD_IOS_CREDENTIALS_PROFILE_PASSWORD,
  withPath
} from '../Constants';
import {
  VALIDATION_OK,
  validateNotEmpty,
  validateGitUrl,
  VALIDATION_ERROR,
  validateNameString
} from '../../common/Validation';

export const setWithValidation = (dispatcher, validation) => (key, value) =>
  dispatcher(key, value, validation(key, value));

/**
 * Check if object has all validations Ok.
 * @param {Object} obj
 */
export function isAllValid(obj) {
  let resolution = true;
  Object.keys(obj).forEach(key => {
    const value = obj[key];
    if (value instanceof Object) {
      resolution = resolution && isAllValid(value);
    }
    if (value === VALIDATION_ERROR) {
      resolution = false;
    }
  });
  return resolution;
}

/**
 * Checks if the state has all mandatory fields filled.
 * @param {*} state create build config state
 */
export function checkMandatoryFields(state) {
  const { validation = {} } = state;
  const { mandatoryFields = {} } = validation;
  let valid = true;
  Object.keys(mandatoryFields).forEach(path => {
    const { fields, affectsFun = () => true } = mandatoryFields[path];
    fields.forEach(field => {
      const hasIt = has(state, withPath(path, field));
      if (affectsFun(state)) valid = valid && hasIt;
    });
  });
  return valid;
}

export function configValidation(key, value) {
  switch (key) {
    case KEY_CR_NAME:
      return validateNameString(value);
    default:
      return VALIDATION_OK;
  }
}

export function buildValidation(key, value) {
  return VALIDATION_OK;
}

export function sourceValidation(key, value) {
  switch (key) {
    case KEY_CR_SOURCE_GITURL:
      return validateGitUrl(value);
    case KEY_CR_SOURCE_GITREF:
      return validateNotEmpty(value);
    case KEY_CR_SOURCE_JENKINS_FILE_PATH:
      return validateNotEmpty(value);
    default:
      return VALIDATION_OK;
  }
}

export function basicAuthValidation(key, value) {
  switch (key) {
    case KEY_CR_BASIC_AUTH_NAME:
    case KEY_CR_BASIC_AUTH_USERNAME:
    case KEY_CR_BASIC_AUTH_PASSWORD:
      return validateNotEmpty(value);
    default:
      return VALIDATION_OK;
  }
}

export function sshAuthValidation(key, value) {
  switch (key) {
    case KEY_CR_SSH_AUTH_NAME:
    case KEY_CR_SSH_PRIVATE_KEY:
      return validateNotEmpty(value);
    default:
      return VALIDATION_OK;
  }
}

export function androidCredentialsValidation(key, value) {
  switch (key) {
    case KEY_CR_BUILD_ANDROID_CREDENTIALS_NAME:
    case KEY_CR_BUILD_ANDROID_CREDENTIALS_KEYSTORE:
    case KEY_CR_BUILD_ANDROID_CREDENTIALS_KEYSTORE_ALIAS:
    case KEY_CR_BUILD_ANDROID_CREDENTIALS_KEYSTORE_PASSWORD:
      return validateNotEmpty(value);
    default:
      return VALIDATION_OK;
  }
}
export function iOSCredentialsValidation(key, value) {
  switch (key) {
    case KEY_CR_BUILD_IOS_CREDENTIALS_NAME:
    case KEY_CR_BUILD_IOS_CREDENTIALS_DEVELOPER_PROFILE:
    case KEY_CR_BUILD_IOS_CREDENTIALS_PROFILE_PASSWORD:
      return validateNotEmpty(value);
    default:
      return VALIDATION_OK;
  }
}
