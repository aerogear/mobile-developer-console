import { validateNotEmpty, validateGitUrl, validateNameString, VALIDATION_OK, VALIDATION_ERROR } from './Validation';

const checkOk = 'success';
const checkError = 'error';

describe('validateNotEmpty', () => {
  it('has valid length', () => {
    expect(validateNotEmpty('pass')).toEqual(checkOk);
  });

  it('has not a valid length', () => {
    expect(validateNotEmpty('')).toEqual(checkError);
  });

  it('has null length', () => {
    expect(validateNotEmpty(null)).toEqual(checkError);
  });
});

describe('validateGitUrl', () => {
  it('has valid url', () => {
    expect(validateGitUrl('http://test.git')).toEqual(checkOk);
  });

  it('has not a valid url', () => {
    expect(validateGitUrl('')).toEqual(checkError);
  });

  it('has null length', () => {
    expect(validateGitUrl(null)).toEqual(checkError);
  });
});

describe('validateNameString', () => {
  it('has valid url', () => {
    expect(validateNameString('passname19')).toEqual(checkOk);
  });

  it('has not a valid url', () => {
    expect(validateNameString('FailName!!')).toEqual(checkError);
  });

  it('has null length', () => {
    expect(validateNameString(null)).toEqual(checkError);
  });
});

describe('Check constants', () => {
  it('VALIDATION_OK == success', () => {
    expect(VALIDATION_OK).toEqual(checkOk);
  });

  it('VALIDATION_ERROR == error', () => {
    expect(VALIDATION_ERROR).toEqual(checkError);
  });
});
