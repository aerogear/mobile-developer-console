import { CompositeRule } from './CompositeRule';

describe('CompositeRule - ALL', () => {
  const rule = new CompositeRule({
    type: 'composite',
    algorithm: 'all',
    error: 'Value must be an URL with max length of 16',
    validation_rules: [
      {
        type: 'isurl'
      },
      {
        type: 'maxlength',
        length: 16
      }
    ]
  });

  it('should validate a valid URL', () => {
    const result = rule.validate({ data: 'http://localhost' }, 'data');

    expect(result).toEqual({ valid: true });
  });

  it('should not validate an invalid url', () => {
    const result = rule.validate({ data: 'http://www.' }, 'data');
    expect(result).toEqual({ valid: false, error: 'Value must be an URL with max length of 16' });
  });

  it('should not validate a valid URL longer than 16 character', () => {
    const result = rule.validate({ data: 'http://www.google.com' }, 'data');
    expect(result).toEqual({ valid: false, error: 'Value must be an URL with max length of 16' });
  });

  it('should not validate a null value', () => {
    const result = rule.validate({}, 'data');
    expect(result).toEqual({ valid: false, error: 'Value must be an URL with max length of 16' });
  });
});

describe('CompositeRule - any', () => {
  const rule = new CompositeRule({
    type: 'composite',
    algorithm: 'any',
    error: 'Value must be either a valid URL or a mailto address',
    validation_rules: [
      {
        type: 'isurl'
      },
      {
        type: 'ismailto'
      }
    ]
  });

  it('should validate a valid URL', () => {
    const result = rule.validate({ data: 'http://localhost' }, 'data');

    expect(result).toEqual({ valid: true });
  });

  it('should validate mailto', () => {
    const result = rule.validate({ data: 'mailto:admin@example.com' }, 'data');
    expect(result).toEqual({ valid: true });
  });

  it('should not validate an invalid url and invalid mailto', () => {
    const result = rule.validate({ data: 'http://www.' }, 'data');
    expect(result).toEqual({ valid: false, error: 'Value must be either a valid URL or a mailto address' });
  });

  it('should not validate a null value', () => {
    const result = rule.validate({}, 'data');
    expect(result).toEqual({ valid: false, error: 'Value must be either a valid URL or a mailto address' });
  });

  it('should not validate a empty value', () => {
    const result = rule.validate({ data: '' }, 'data');
    expect(result).toEqual({ valid: false, error: 'Value must be either a valid URL or a mailto address' });
  });
});
