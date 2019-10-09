import { ValidateECDSAKey } from './ValidateECDSAKey';

describe('ValidateECDSAKey', () => {
  it('should validate a valid key', () => {
    const rule = new ValidateECDSAKey({ encoding: 'base64' });
    let result = rule.validate(
      { data: 'BMdHNmd1rJR0HdqLeXsZAfvmlqAAVxdEUTZEgn0qe-0SQYjiLtHBmV_UhnrV3kzA2_bvqiaTW1Ts3fyZ6RE-fG0' },
      'data'
    );
    expect(result).toEqual({ valid: true });
    result = rule.validate({ data: 'VuKaKq9khz4kswSLikJjAJxIKxQPxJWkVmDxPn00TBM' }, 'data');
    expect(result).toEqual({ valid: true });
  });

  it('should validate a valid public key', () => {
    const rule = new ValidateECDSAKey({ encoding: 'base64', keyType: 'public' });
    const result = rule.validate(
      { data: 'BMdHNmd1rJR0HdqLeXsZAfvmlqAAVxdEUTZEgn0qe-0SQYjiLtHBmV_UhnrV3kzA2_bvqiaTW1Ts3fyZ6RE-fG0' },
      'data'
    );
    expect(result).toEqual({ valid: true });
  });

  // it('should not validate an invalid b64', () => {
  //   const rule = new ValidateECDSAKey({ encoding: 'base64' });
  //   let result = rule.validate({ data: 'asdfasf' }, 'data');
  //   expect(result).toEqual({ valid: false, error: 'invalid' });
  // });
});
