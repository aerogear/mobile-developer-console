// {
//   "type": "P12VALIDATOR",
//   "error": "APNS certificate passphrase is required."
//   "password_field": "fieldname"
// }

import forge from 'node-forge';

/**
 * This rule is used to verify that the provided Base64 string is a valid PKCS#12 file.
 * It can even check if the provided password is valid (if configured)
 *
 * The configuration for this rule must be as follows:
 * {
 *   "type": "P12VALIDATOR",  // this must be exactly 'required'
 *   "error": "Your error message" // Optional. If not specified a default message is used.
 *   "password_field": "passwordFieldName" // Optional. The name of the field containing the PKCS#12 password
 * }
 */
export class P12ValidationRule {
  constructor(config) {
    this.config = config;
    this.passwordField = config.password_field;
  }

  validate(data, key) {
    const p12b64 = data[key];
    if (p12b64) {
      try {
        const p12Der = forge.util.decode64(p12b64);
        const p12Asn1 = forge.asn1.fromDer(p12Der);

        if (this.passwordField) {
          const password = data[this.passwordField];
          forge.pkcs12.pkcs12FromAsn1(p12Asn1, password);
        }
      } catch (error) {
        return {
          valid: false,
          error: this.config.error || error.message
        };
      }
    }
    return { valid: true };
  }
}

export const NAME = 'P12VALIDATOR';
