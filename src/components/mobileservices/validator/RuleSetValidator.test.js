import { RuleSetValidator } from './RuleSetValidator';

const ANDROID_UPS_BINDING = {
  executionConstraints: [
    {
      comment: "Execute this ruleset only when the field named 'CLIENT_TYPE' has value 'Android'",
      type: 'FIELD_VALUE',
      name: 'CLIENT_TYPE',
      value: 'Android'
    }
  ],
  fields: {
    platformConfig: {
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
};

describe('RuleSetValidator', () => {
  it('create ruleSetValidator with config details', () => {
    const ruleSetValidator = new RuleSetValidator('ANDROID_UPS_BINDING', ANDROID_UPS_BINDING);
    expect(ruleSetValidator.name).toEqual('ANDROID_UPS_BINDING');
  });

  it('create ruleSetValidator without config details', () => {
    const ruleSetValidator = new RuleSetValidator('ANDROID_UPS_BINDING');
    expect(ruleSetValidator.name).toEqual('ANDROID_UPS_BINDING');
  });

  it('validate field passes as expected', () => {
    const ruleSetValidator = new RuleSetValidator('ANDROID_UPS_BINDING', ANDROID_UPS_BINDING);

    const input = {
      platformConfig: {
        googlekey: '12345678',
        projectNumber: '87654321'
      }
    };

    const expectedResult = { valid: true };
    expect(ruleSetValidator.validateField(input, 'platformConfig.googlekey')).toEqual(expectedResult);
    expect(ruleSetValidator.validateField(input, 'platformConfig.projectNumber')).toEqual(expectedResult);
  });

  it('validate field fails as expected', () => {
    const ruleSetValidator = new RuleSetValidator('ANDROID_UPS_BINDING', ANDROID_UPS_BINDING);

    const input = {
      platformConfig: {
        googlekey: undefined
      }
    };

    const notExpected = { valid: true };
    const expected = { valid: false, error: 'Key not found' };

    expect(ruleSetValidator.validateField(input, 'platformConfig.googlekey')).not.toEqual(notExpected);
    expect(ruleSetValidator.validateField(input, 'platformConfig.projectNumber')).not.toEqual(notExpected);
    expect(ruleSetValidator.validateField()).toEqual(expected);
  });

  it('add new rule to rule set', () => {
    const ruleSetValidator = new RuleSetValidator('ANDROID_UPS_BINDING', ANDROID_UPS_BINDING);

    const newRule = {
      'platformConfig.testrule': {
        errors_key: 'test_rule_error_key',
        validation_rules: [
          {
            type: 'required',
            error: 'The test rule is required'
          }
        ]
      }
    };
    ruleSetValidator.addRule(newRule);
    expect(ruleSetValidator.fields['platformConfig.testrule']).toEqual(newRule['platformConfig.testrule']);
  });

  it('add validation rule to existing rule set', () => {
    const ruleSetValidator = new RuleSetValidator('ANDROID_UPS_BINDING', ANDROID_UPS_BINDING);

    const newRule = {
      'platformConfig.testrule': {
        errors_key: 'test_rule_error_key',
        validation_rules: [
          {
            type: 'required',
            error: 'The test rule is required'
          }
        ]
      }
    };

    const updatedRule = {
      'platformConfig.testrule': {
        validation_rules: [
          {
            type: 'P12VALIDATOR',
            error: 'Invalid PKCS#12 data or bad password',
            password_field: 'platformConfig.passphrase'
          }
        ]
      }
    };

    const expectedResult = {
      'platformConfig.testrule': {
        errors_key: 'test_rule_error_key',
        validation_rules: [
          {
            type: 'required',
            error: 'The test rule is required'
          },
          {
            type: 'P12VALIDATOR',
            error: 'Invalid PKCS#12 data or bad password',
            password_field: 'platformConfig.passphrase'
          }
        ]
      }
    };
    ruleSetValidator.addRule(newRule);
    ruleSetValidator.addRule(updatedRule);

    expect(ruleSetValidator.fields['platformConfig.testrule']).toEqual(expectedResult['platformConfig.testrule']);
  });
});
