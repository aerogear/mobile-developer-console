import { MaxLengthRule } from './MaxLengthRule';

describe('MaxLengthRule', () => {
  const length = 5;
  const rule = new MaxLengthRule({ length });

  it('should validate a value that has length lower than the allowed maxlength', () => {
    const result = rule.validate({ data: '1234' }, 'data');

    expect(result).toEqual({ valid: true });
  });

  it('should not validate a value that has length greater than the allowed maxlength', () => {
    const result = rule.validate({ data: '123456' }, 'data');

    expect(result).toEqual({ valid: false, error: 'data is too long, maximum length is 5 characters' });
  });

  it('should validate value with the exact length', () => {
    const result = rule.validate({ data: '12345' }, 'data');

    expect(result).toEqual({ valid: true });
  });
});
