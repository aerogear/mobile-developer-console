import forge from 'node-forge';
import { get } from 'lodash-es';
import { ValidationRuleBaseClass } from './ValidationRuleBaseClass';

/**
 * This rule is used to verify that the provided Base64 string is a valid PKCS#12 file.
 * It can even check if the provided password is valid (if configured)
 *
 * The configuration for this rule must be as follows:
 * {
 *   "type": "P12VALIDATOR",                // this must be exactly 'required'
 *   "error": "Your error message"          // Optional. The custom error message.
 *                                          // This can be a string, a dictionary or a function (signature: (key, message) => {})
 *                                          // If not specified, a standard error message is returned.
 *   "password_field": "passwordFieldName"  // Optional. The name of the field containing the PKCS#12 password
 * }
 */
export class P12ValidationRule extends ValidationRuleBaseClass {
  constructor(config) {
    super(config);
    this.passwordField = config.password_field;
  }

  validate(data, key) {
    const p12b64 = get(data, key);
    if (p12b64) {
      try {
        const p12Der = forge.util.decode64(p12b64);
        const p12Asn1 = forge.asn1.fromDer(p12Der);
        if (this.passwordField) {
          const password = get(data, this.passwordField);
          forge.pkcs12.pkcs12FromAsn1(p12Asn1, password);
        }
      } catch (error) {
        return {
          valid: false,
          error: this.getErrorMessage({ key: error.message, message: error.message })
        };
      }
    }
    return { valid: true };
  }
}

export const NAME = 'P12VALIDATOR';
