import { ValidEmailRule } from './ValidEmailRule';

describe('ValidEmailRule', () => {
  const rule = new ValidEmailRule();

  it('should validate a valid email', () => {
    const result = rule.validate({ data: 'test@redhat.com' }, 'data');

    expect(result).toEqual({ valid: true });
  });

  it('should not validate an invalid mail', () => {
    let result = rule.validate({ data: 'test@' }, 'data');
    expect(result).toEqual({ valid: false, error: 'value of data must be a valid email address' });

    result = rule.validate({ data: '@redhat.com' }, 'data');
    expect(result).toEqual({ valid: false, error: 'value of data must be a valid email address' });

    result = rule.validate({ data: 'testAredhat.com' }, 'data');
    expect(result).toEqual({ valid: false, error: 'value of data must be a valid email address' });
  });
});
