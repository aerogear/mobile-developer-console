import { get } from 'lodash-es';
import { ValidationRuleBaseClass } from './ValidationRuleBaseClass';

const EC = require('elliptic').ec;

const ec = new EC('secp256k1');

/**
 * This is a simple rule to check that the value in the field matches the given regex.
 * It must be configured inside the JSON file as follows:
 * {
 *   "type": "isemail",  // this must be exactly 'regexp',
 *   "error": "Your error message"          // Optional. The custom error message.
 *                                          // This can be a string, a dictionary or a function (signature: (key, message) => {})
 *                                          // If not specified, a standard error message is returned.
 * }
 */
export class ValidateECDSAKey extends ValidationRuleBaseClass {
  validateConfig(config) {
    // validate encoding
    if (this.config.encoding) {
      if (this.config.encoding !== 'base64' && this.config.encoding !== 'hex') {
        throw new Error(`Invalid encoding type '${this.config.encoding}'`);
      }
    }
    if (this.config.keyType) {
      if (this.config.keyType !== 'public' && this.config.keyType !== 'private') {
        throw new Error(`Invalid key type '${this.config.keyType}'`);
      }
    }
  }

  validate(formData, key) {
    const tryToExec = fn => {
      try {
        return fn();
      } catch (e) {
        return false;
      }
    };

    const { config } = this;
    const value = get(formData, key);
    let keyVal;
    if (config.encoding === 'base64') {
      keyVal = tryToExec(() => Buffer.from(value, 'base64').toString('ascii'));
    } else {
      keyVal = value;
    }

    let valid = 0;

    if (keyVal) {
      if (!config.keyType || config.keyType === 'public' || config.keyType === 'any') {
        // validate a public key
        if (tryToExec(() => ec.keyFromPublic(keyVal, this.config.encoding)).pub) {
          valid++;
        }
      }

      if (!config.keyType || config.keyType === 'private' || config.keyType === 'any') {
        // validate a private key
        // const kp = tryToExec(() => ec.keyFromPrivate(keyVal, this.config.encoding === 'hex' ? 'hex' : null));
        const kp = tryToExec(() => ec.keyFromPrivate(keyVal, this.config.encoding === 'hex' ? 'hex' : null));
        if (kp.priv) {
          valid++;
        }
      }
    }

    if (valid) {
      return { valid: true };
    }
    return {
      valid: false,
      error: this.getErrorMessage({
        key,
        message: `value of '${key}' must be a valid ${
          this.config.keyType ? this.config.keyType : 'public or private'
        } ecdsa key`
      })
    };
  }
}

// config
//   encoding: base64 or HEX
//   type: public, private, any|null

export const NAME = 'isecdsa';
