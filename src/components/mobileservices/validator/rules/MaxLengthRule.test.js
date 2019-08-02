import { MaxLengthRule } from './MaxLengthRule';

describe('MaxLengthRule', () => {
  const length = 5;
  const rule = new MaxLengthRule({ length });

  it('should be valid', () => {
    const result = rule.validate({ data: '1234' }, 'data');

    expect(result).toEqual({ valid: true });
  });

  it('should be invalid', () => {
    const result = rule.validate({ data: '123456' }, 'data');

    expect(result).toEqual({ valid: false, error: 'data is too big, maximum length is 5' });
  });
});
