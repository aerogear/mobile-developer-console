import { NAME } from './RequiredRule';
import { ValidationRule } from './ValidationRule';

const TEST_FIELD = 'test_field';
const TEST_ERROR_MSG = `Missing mandatory field ${NAME}`;
const STANDARD_ERROR_MSG = `${TEST_FIELD} is a required field.`;
const config = {
  type: NAME,
  name: TEST_FIELD,
  error: TEST_ERROR_MSG
};

describe('RequiredRule', () => {
  it('should return error with a custom error message since the value is null', () => {
    const rule = ValidationRule.forRule(config);
    const result = rule.validate(TEST_FIELD, null);
    expect(result).toEqual({ valid: false, error: TEST_ERROR_MSG });
  });

  it('should return error with a standard error message since the value is null', () => {
    const testConfig = {
      type: NAME,
      name: TEST_FIELD
    };
    const rule = ValidationRule.forRule(testConfig);
    const result = rule.validate({}, TEST_FIELD);
    expect(result).toEqual({ valid: false, error: STANDARD_ERROR_MSG });
  });

  it('should return valid', () => {
    const rule = ValidationRule.forRule(config);
    const result = rule.validate({ [TEST_FIELD]: 'somevalue' }, TEST_FIELD);
    expect(result).toEqual({ valid: true });
  });
});
