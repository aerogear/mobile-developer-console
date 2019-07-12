import { ValidationRule } from './ValidationRule';
import { NAME as REQUIRED } from './RequiredRule';
import { NAME as SAMEVALUEOF } from './SameValueOfRule';
import { NAME as P12VALIDATOR } from './P12ValidatorRule';
import { NAME as REGEXP } from './RegExpRule';

describe('Checking ValidationRule paths', () => {
  let expected;

  beforeEach(() => {
    expected = { valid: true };
  });

  it('has ruleType of REQUIRED', () => {
    const config = {
      type: REQUIRED,
      target: 'data.password',
      error: 'Custom error message',
      data: {
        password: '12345678'
      }
    };
    const result = ValidationRule.forRule(config).validate(config, 'data.password');
    expect(result).toEqual(expected);
  });

  it('has ruleType of SAMEVALUEOF', () => {
    const config = {
      type: SAMEVALUEOF,
      target: 'data.passwordConfirmation',
      error: 'Custom error message',
      data: {
        password: '12345678',
        passwordConfirmation: '12345678'
      }
    };
    const result = ValidationRule.forRule(config).validate(config, 'data.password');
    expect(result).toEqual(expected);
  });

  it('has ruleType of P12VALIDATOR', () => {
    const config = {
      type: P12VALIDATOR,
      error: 'Fail message',
      data: {
        password: '12345678'
      }
    };
    const result = ValidationRule.forRule(config).validate(config, 'data.password');

    expected = {
      error: 'Fail message',
      valid: false
    };
    expect(result).toEqual(expected);
  });

  it('has ruleType of REGEXP', () => {
    const config = {
      type: REGEXP,
      regexp: /^https?:\/\/.{1}/,
      data: {
        url: 'https://www.redhat.com'
      }
    };
    const result = ValidationRule.forRule(config).validate(config, 'data.url');
    expect(result).toEqual(expected);
  });

  it('has ruleType of default switch case', () => {
    const config = { type: 'default' };
    const result = ValidationRule.forRule(config).validate();
    expect(result).toEqual(expected);
  });
});
