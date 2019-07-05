import { RegExpRule } from './RegExpRule';

describe('RegexpRule', () => {
  const regexp = /^https?:\/\/.{1}/;
  const regexpRule = new RegExpRule({ regexp });

  it('should be valid', () => {
    const result = regexpRule.validate({ url: 'https://www.google.com' }, 'url');

    expect(result).toEqual({ valid: true });
  });

  it('should be invalid', () => {
    const result = regexpRule.validate({ url: 'ws://www.google.com' }, 'url');

    const expectedResult = {
      valid: false,
      error: `url does not match regexp ${regexp.toString()}`
    };

    expect(result).toEqual(expectedResult);
  });
});
