import { FormValidator } from './FormValidator';

const config = {
  rulesets: {
    COMMON: {
      comment: 'This set of rules is always executed. It is used to validate common fields.',
      fields: {
        CLIENT_ID: {
          validation_rules: [
            {
              type: 'required'
            }
          ]
        },
        CLIENT_TYPE: {
          validation_rules: [
            {
              type: 'required'
            }
          ]
        }
      }
    },
    IOS_UPS_BINDING: {
      comment: 'This is the set of rules that will be used to validate IOS UPS Binding.',
      executionConstraints: [
        {
          comment: "Execute this ruleset only when the field named 'CLIENT_TYPE' has value 'IOS'",
          type: 'FIELD_VALUE',
          name: 'CLIENT_TYPE',
          value: 'IOS'
        }
      ],
      fields: {
        cert: {
          comment: "Errors relative to this field should be bound to the key 'iosIsProduction'",
          errors_key: 'iosIsProduction',
          validation_rules: [
            {
              type: 'required',
              error: 'APNS requires a certificate.'
            }
          ]
        },
        passphrase: {
          errors_key: 'iosIsProduction',
          validation_rules: [
            {
              type: 'required',
              error: 'APNS certificate passphrase is required.'
            }
          ]
        }
      }
    },
    ANDROID_UPS_BINDING: {
      comment: 'This is the set of rules that will be used to validate Android UPS Binding.',
      executionConstraints: [
        {
          comment: "Execute this ruleset only when the field named 'CLIENT_TYPE' has value 'Android'",
          type: 'FIELD_VALUE',
          name: 'CLIENT_TYPE',
          value: 'Android'
        }
      ],
      fields: {
        googlekey: {
          validation_rules: [
            {
              type: 'required',
              error: 'FCM requires a Server Key.'
            }
          ]
        },
        projectNumber: {
          validation_rules: [
            {
              type: 'required',
              error: 'FCM requires a Sender ID..'
            }
          ]
        }
      }
    }
  }
};

const mock = { addError: jest.fn() };
const errors = { CLIENT_ID: mock, CLIENT_TYPE: mock, googlekey: mock, projectNumber: mock };

describe('FormValidator', () => {
  it('should return valid - Android config', () => {
    const validator = new FormValidator(config);

    const formData = {
      CLIENT_ID: 'client_id',
      CLIENT_TYPE: 'Android',
      googlekey: 'testgooglekey',
      projectNumber: 'testProjectNumber'
    };
    const valid = validator.validate(formData, errors);
    expect(valid).toBe(true);
  });

  it('should return invalid since CLIENT_ID is not there - Android config', () => {
    const validator = new FormValidator(config);

    const formData = {
      CLIENT_TYPE: 'Android',
      googlekey: 'testgooglekey',
      projectNumber: 'testProjectNumber'
    };
    const valid = validator.validate(formData, errors);
    expect(valid).toBe(false);
  });

  it('should return invalid since CLIENT_TYPE is not there - Android config', () => {
    const validator = new FormValidator(config);

    const formData = {
      CLIENT_ID: 'client_id',
      googlekey: 'testgooglekey',
      projectNumber: 'testProjectNumber'
    };
    const valid = validator.validate(formData, errors);
    expect(valid).toBe(false);
  });

  it('should return invalid since googlekey is not there - Android config', () => {
    const validator = new FormValidator(config);

    const formData = {
      CLIENT_TYPE: 'Android',
      CLIENT_ID: 'client_id',
      projectNumber: 'testProjectNumber'
    };
    const valid = validator.validate(formData, errors);
    expect(valid).toBe(false);
  });

  it('should return valid - IOS config', () => {
    const validator = new FormValidator(config);

    const formData = {
      CLIENT_TYPE: 'IOS',
      CLIENT_ID: 'client_id',
      cert: 'cert',
      password: 'password'
    };
    const valid = validator.validate(formData, errors);
    expect(valid).toBe(true);
  });
});
