
export const DNS1123_SUBDOMAIN_VALIDATION = {
    pattern: /^[a-z0-9]([-a-z0-9]*[a-z0-9])?(\.[a-z0-9]([-a-z0-9]*[a-z0-9])?)*$/,
    maxlength: 253,
    description: 'Name must consist of lower-case letters, numbers, periods, and hyphens. It must start and end with a letter or a number.'
  };

export function createSecretName(prefix) {
    const secretNamePrefixMaxLength = DNS1123_SUBDOMAIN_VALIDATION.length - 6; //We append a 5 digit code and a -;

    if (prefix.length > secretNamePrefixMaxLength) {
        prefix = prefix.substring(0, secretNamePrefixMaxLength);
    }

    const randomString = Math.round((Math.pow(36, 6) - Math.random() * Math.pow(36, 6))).toString(36).slice(1);

    prefix += randomString;
    return prefix;
}
