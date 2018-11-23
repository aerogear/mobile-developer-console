import { NAME } from './FieldValueConstraint';
import { Constraint } from './Constraint';

const config = {
  type: NAME,
  name: 'test_field',
  value: 'test_value'
};

describe('FieldValueConstraint', () => {
  it('should return false since the field is not there', () => {
    const constraint = Constraint.forConfig(config);
    const result = constraint.check({});
    expect(result).toBe(false);
  });

  it('should return false since the field has a different value', () => {
    const constraint = Constraint.forConfig(config);
    const result = constraint.check({ test_field: 'test' });
    expect(result).toBe(false);
  });

  it('should return true', () => {
    const constraint = Constraint.forConfig(config);
    const result = constraint.check({ test_field: 'test_value' });
    expect(result).toBe(true);
  });
});
