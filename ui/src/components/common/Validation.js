import isGitUrl from 'is-git-url';

/* Validation states */
export const VALIDATION_OK = 'success';
export const VALIDATION_ERROR = 'error';
export const VALIDATION_WARN = 'warning';

export function validateNotEmpty(value) {
  return value && value.length > 0 ? VALIDATION_OK : VALIDATION_ERROR;
}

export function validateGitUrl(value) {
  return value && isGitUrl(value) ? VALIDATION_OK : VALIDATION_ERROR;
}
