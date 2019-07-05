import { SameValueOfRule } from './SameValueOfRule';

describe('SameValueOfRule Validation', () => {
  it('target value is a undefined', () => {
    const config = { target: 'data.passwordConfirmation', error: 'Custom error message' };
    const sameValueOfRule = new SameValueOfRule(config);

    const input = {
      data: { password: undefined, passwordConfirmation: undefined }
    };
    const value = sameValueOfRule.validate(input, 'data.password');
    const expectResult = { valid: true };

    expect(value).toEqual(expectResult);
  });

  it('target value is a null', () => {
    const config = { target: 'data.passwordConfirmation', error: 'Custom error message' };
    const sameValueOfRule = new SameValueOfRule(config);

    const input = {
      data: { password: null, passwordConfirmation: null }
    };
    const value = sameValueOfRule.validate(input, 'data.password');
    const expectResult = { valid: true };

    expect(value).toEqual(expectResult);
  });

  it('target value is a string', () => {
    const config = { target: 'data.passwordConfirmation', error: 'Custom error message' };
    const sameValueOfRule = new SameValueOfRule(config);

    const input = {
      data: { password: '12345678', passwordConfirmation: '12345678' }
    };

    const value = sameValueOfRule.validate(input, 'data.password');
    const expectResult = { valid: true };

    expect(value).toEqual(expectResult);
  });

  it('target value is a function', () => {
    const config = { target: () => '12345678', error: 'Custom error message' };
    const sameValueOfRule = new SameValueOfRule(config);

    const input = {
      data: { password: '12345678', passwordConfirmation: '12345678' }
    };

    const value = sameValueOfRule.validate(input, 'data.password');
    const expectResult = { valid: true };

    expect(value).toEqual(expectResult);
  });

  it('validate fails', () => {
    const config = { target: 'data.passwordConfirmation', error: 'Custom error message' };
    const sameValueOfRule = new SameValueOfRule(config);

    const input = {
      data: { password: '12345678', passwordConfirmation: '87654321' }
    };
    const value = sameValueOfRule.validate(input, 'data.password');
    const expectResult = { valid: false, error: config.error };
    expect(value).toEqual(expectResult);
  });
});
