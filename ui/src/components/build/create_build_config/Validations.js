import {
  KEY_CR_NAME,
  KEY_CR_SOURCE_GITURL,
  KEY_CR_SOURCE_GITREF,
  KEY_CR_SOURCE_JENKINS_FILE_PATH,
  KEY_CR_BASIC_AUTH_NAME,
  KEY_CR_BASIC_AUTH_PASSWORD,
  KEY_CR_BASIC_AUTH_USERNAME,
  KEY_CR_SSH_AUTH_NAME,
  KEY_CR_SSH_PRIVATE_KEY
} from '../Constants';
import { VALIDATION_OK, validateNotEmpty, validateGitUrl } from '../../common/Validation';

export function configValidation(values, key, value) {
  switch (key) {
    case KEY_CR_NAME:
      return validateNotEmpty(value);
    default:
      return VALIDATION_OK;
  }
}

export function buildValidation(values, key, value) {
  return VALIDATION_OK;
}

export function sourceValidation(values, key, value) {
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

export function basicAuthValidation(values, key, value) {
  switch (key) {
    case KEY_CR_BASIC_AUTH_NAME:
    case KEY_CR_BASIC_AUTH_USERNAME:
    case KEY_CR_BASIC_AUTH_PASSWORD:
      return validateNotEmpty(value);
    default:
      return VALIDATION_OK;
  }
}

export function sshAuthValidation(values, key, value) {
  switch (key) {
    case KEY_CR_SSH_AUTH_NAME:
    case KEY_CR_SSH_PRIVATE_KEY:
      return validateNotEmpty(value);
    default:
      return VALIDATION_OK;
  }
}
