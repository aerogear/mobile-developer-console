import { ValidUrlRule } from './ValidUrlRule';

describe('ValidUrlRule', () => {
  const rule = new ValidUrlRule({ error: 'Invalid URL' });

  it('should validate a valid url', () => {
    const result = rule.validate({ data: 'http://example.com' }, 'data');
    expect(result).toEqual({ valid: true });
  });

  it('should validate localhost', () => {
    const result = rule.validate({ data: 'http://localhost' }, 'data');
    expect(result).toEqual({ valid: true });
  });

  it('should not validate an invalid url', () => {
    const result = rule.validate({ data: 'invalid' }, 'data');
    expect(result).toEqual({ valid: false, error: 'Invalid URL' });
  });
});
