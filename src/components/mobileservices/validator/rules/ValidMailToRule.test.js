import { ValidMailToRule } from './ValidMailToRule';

describe('ValidMailToRule', () => {
  const rule = new ValidMailToRule({ error: 'Invalid mailto' });

  it('should validate a valid mailto', () => {
    const result = rule.validate({ data: 'mailto: admin@example.com' }, 'data');
    expect(result).toEqual({ valid: true });
  });

  it('should not validate mailto without "mailto:"', () => {
    const result = rule.validate({ data: 'admin@example.com' }, 'data');
    expect(result).toEqual({ valid: false, error: 'Invalid mailto' });
  });

  it('should not validate mailto with invalid mail', () => {
    const result = rule.validate({ data: 'mailto: admin@' }, 'data');
    expect(result).toEqual({ valid: false, error: 'Invalid mailto' });
  });

  it('should not validate mailto with empty email', () => {
    const result = rule.validate({ data: 'mailto:     ' }, 'data');
    expect(result).toEqual({ valid: false, error: 'Invalid mailto' });
  });
});
