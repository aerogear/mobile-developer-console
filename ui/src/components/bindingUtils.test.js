import { createSecretName } from './bindingUtils';

describe('Binding util', () => {
  it('should return valid secret name', () => {
    const prefix = 'test';
    const expectedSecretNameLength = prefix.length + 6;
    const secretName = createSecretName(prefix);
    expect(secretName).toHaveLength(expectedSecretNameLength);
  });
  it('should shorten a secret prefix and return a valid secret name', () => {
    const prefix = 'p'.repeat(1000);
    const domainNameMaxLength = 253;
    const secretName = createSecretName(prefix);
    expect(secretName.length).toBeLessThanOrEqual(domainNameMaxLength);
  });
});
