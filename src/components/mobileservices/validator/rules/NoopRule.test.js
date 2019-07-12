import { NoopRule } from './NoopRule';

describe('NoopRule', () => {
  it('validate works as expected', () => {
    const config = {};
    const noopRule = new NoopRule(config);

    const result = noopRule.validate();
    const expected = { valid: true };

    expect(result).toEqual(expected);
  });
});
