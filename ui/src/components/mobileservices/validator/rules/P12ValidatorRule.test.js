import { ValidationRule } from './ValidationRule';
import { NAME } from './P12ValidatorRule';

const P12 =
  'MIIKNAIBAzCCCf4GCSqGSIb3DQEHAaCCCe8EggnrMIIJ5zCCBGcGCSqGSIb3DQEHBqCCBFgwggRUAgEAMIIETQYJKoZIhvcNAQcBMBwGCiqGSIb3DQEMAQYwDgQIeTysvHdpFkQCAggAgIIEIDn91La3jT146rs606YeHac5mI+ZtBz3gUSlqPErKOzFL9z64cbqEtVk9JHIqvA1nfZyxMVRLZ0VMbliKYQL0w+Juk5NaS6wNxo4ABIGTCPTDCnRiW7mC4k0c7pvEB5QkKzXNnVJlxKkYfmE0+locMNao5gGoODS13n1XN3Ehju+I4pnxOeoZ9Ls5Rx3yfazmT2LZzSEj7ScPsfyDfewWAurRhik/O2eDQSJUUqnJIUGLTH5d+h2FfKI7y8i1Fiv2wHLCTzslXeEM662iDo7sqavOZepIC5e23g/QLo67bR67VHkW+BzlggIXKXZ48XtPTYJ5JA2rDG4MXLahmVUZFQ1//15C/jgNSiKubDa5/Bfzf9e+PLG+A+PD+etk1J1dcceqVuYc56eMbcuyZrjB3TJm5Sno33iw/bHBq+PuZHnlmkW8u9UU5rqpVsj2fD3bnZvWadVHMIFaQq+SwoJEJ3jAvIMSiaEPSJMGDrwIciwSqYnStXvK4tgluz1zeXIA6iDeyvw1PSe5LE855V8k0vsyObaMwckckPYhWiDyWXyaOOO1Bqsf4T1BgJABxyyrL67y+a2drdRlWrI2uoaAKniDcTL6JeMWjcfBbyFtzOdm1dL6hjB/UtbchBAsfOJnrLyo5XJbgk2hZaITu/w8GCOrfdeXrWmGZRI0wfmve+y0yJpBiqOKuA3RII3+1H3y7fZtC5Vt55jyNVR+ccJ0ulU+/RkVjFU2KFKOFHgj6TpNsoAnpo46Hnf2lvo8CZIB0MezmlnEXEHGCorKUfmGU090GMsy5O4wvEIO7W0CTDQaC5oteLkbgDKo6gKiR0IFQPGFONgU0PBljBog47Jl89vfcVjhWqJfMqlIoB+lzigIkb8w9+0H6eLjJwOaS4k6LWFHjHfxt1gZcgVVXJ6w1Fm2lCspkROYOzUZIiabK8X3E1Zv0Jn/tt3Ubn51+GHRS0GxSI0H9gWmn6yjdRphJIIB8iKJ10RBdzlDOgADJhiByyLk8wlYB1rFTGlYIfzTUXtshtuNGOwNb139vnr++My6vGFZhwqwCw/De+FLJJowYFvxr9Sk7KUjSRh7vtajP2XSOqK83XzjrNxNdGikO90KpYqeaODneWz3CzTwxdKDvRGgbzJTPkIAVE4vDKxYofrBvzBopwNHFLX95hCPU1Mp2vZOtBjqYdwaUdCvzyIWGfvR02rA7+jsUPMtpIykHBVO3ZpVn1CmnQaQWWV4PSUglx7Kvu/EngtnpvofOHXkju5WmVo4W7Wnb/OLP8GTv2MtsihLR02W+dhAhl5tx9A+yI8zkyWtLDRBhqIMNJKp9qzPTX2aLYFxcm7QNCyPU7AxEuxM0IHeQ3bpIvvD5O2hd9YFZyDc1fKXDoNGA41eB36CMH2/T+zHYbRtjHD4jCCBXgGCSqGSIb3DQEHAaCCBWkEggVlMIIFYTCCBV0GCyqGSIb3DQEMCgECoIIE7jCCBOowHAYKKoZIhvcNAQwBAzAOBAi33d1UVlZzOwICCAAEggTIptCM4vlx+MQJTdYAR7kVp/HauSD1hmP7qaHDxmbl1mJXQpAhlIyJY5RI3mXnMlvg+ehA6rI6KXx0qph7wVjEQAR6V+qI4q6h7qCEB85v6SMkv4vpGFSrkBAjh3dBRxIlhkofbBGCpsvmo3993CgI2XvwswDIgepwjDpBftdzfX40PYl+FnNpa9L1l6DI7Zmlc8cB71eMWLpOH/D/gdnUlLdhJCAKNPDl67icqqa3W0W6JJhvL4OCbATC4Bm3caevcK3WrG6a6+OBWw0/dgyZ5hwPo0qSY7pKXo6IzeEdHh6+MwEg9d9Th9tVWOyyEHBKj7sl3qkdAvD7xG+jpZxEPAaP28KZfD7eM4Q39ycfBfQSRvb7Mm3onU8xxCwYrC0Mg1rnA4KRbMtGePyJGmmtMXJvdwJztBPMi1cWLun7GeEjj5l6sT/9YynnP/3dYOEPnR+xZ8x/XzGET5XdmjbB7fPGeSts8PoJ7MTj1NoDDxI6fa+w/GVyb/o7HNWUwO0Lge7MVkotwRJ6ExAAaJ/IG9AipomqDPadn8d2CjRyTwCo4S44hYZ8I2MD8pLb2aPPtQtmS9HSCIcov7VyhXEcHldDyYN0sDEwOUgjewdGqPmNHZ03i60s/DHAQRYasPT7Re/k7Ue7f8tY6fXGTawqi8HU/LhuMckXWugFpt8LcupNd7JnSmtX/gKw28TKSZ66+zu+sNc5eK6aA7rU2BMlJmJtgBmjwctip640gn7qYxUDGXAGvspKbPcDZgUWOS3ZTkuxtL1HIWs5+H8oIpKmQ36QgsE6jpnywmtBMFsqvZRqrllHaxbkE0VPzAFZIgr7Jms1BBfBwrHUpimew91hBOjo7ftEEIWXgeuL/aOYwnTSmqUm2RUodpHTJKh44nSrB587gqsXFrWGrSv00qX0BxH2EFpNsGcFRxu2JbG9/kK86Yu0XK1QpHwKKuqdI1/F/+cDV7l94eTm+D9lt1rUNYuPrEZseX+OJfHqqmKxcfnzvo2VnVIxBWk/VmOqKtU1Bj1cDk4oV2fY/s+w7mQ7ivPqNB47kPo2xFTbPcoRo/ZvqGMIchcjXJYalItGRP6h17H53yyW1kRW0dYrXiwPvL0ZXcRoXJM9NsFonxGTNNWqlJuU+d0Iz3eFxe8JiAq/l86/O/OV1gQzrY8V1jku/GOs42GTYAYLEyil4dSma+HXE80EnLVNaSH8rUIEckTeZXw649qxUruWDxAT99r5+ux1wse9mAp5vgjTaryVkH+rIetBdAvvpnsGq74DV2KscxGrFDoiOnTEiOHuDuzQ4lWlXEt73VNXO2cQQ/lc7Bw+qyOzX/YOtIsCTa0QCWWKVjpPLJum+kFmlZ2tiYozID1anrS6r8hFfvcDcca5PKavFukIlKk7C6OGw2PQVv8LUjShMgZ24ZSO6mGJcqCwCnfdX7ESd6xwD+PuZARY6u+jR5y22dWma1qUhZlSmLMg25tPotHpIY9miu3UFi76VDRcwL+QJL9S8R0Hhrg3xdgKEmQlsry3Nre4rf0RBhkbMi8z9F3k7R2gMrvBleAQREVYmfwcoD/ggxXOq7spDNzb8ltZUK4rrlOcNrlINyfQtismeqyUkzHkKnBwJRoyq1/epk2oa5PJMVwwIwYJKoZIhvcNAQkVMRYEFJvjHA92roD7e8fxoZMM3fV29CNUMDUGCSqGSIb3DQEJFDEoHiYAbQB6AGkAYwBjAGEAcgBkAEAAcgBlAGQAaABhAHQALgBjAG8AbTAtMCEwCQYFKw4DAhoFAAQUt/C+5yVnKXCOJ0ox54WcUbsJF4cECOM0KBdtX41v';

const WRONGB64ENCODEDFILE =
  'TG9yZW0gaXBzdW0gZG9sb3Igc2l0IGFtZXQsIGNvbnNlY3RldHVyIGFkaXBpc2NpIGVsaXQsIHNlZCBlaXVzbW9kIHRlbXBvciBpbmNpZHVudCB1dCBsYWJvcmUgZXQgZG9sb3JlIG1hZ25hIGFsaXF1YS4gVXQgZW5pbSBhZCBtaW5pbSB2ZW5pYW0sIHF1aXMgbm9zdHJ1bSBleGVyY2l0YXRpb25lbSB1bGxhbSBjb3Jwb3JpcyBzdXNjaXBpdCBsYWJvcmlvc2FtLCBuaXNpIHV0IGFsaXF1aWQgZXggZWEgY29tbW9kaSBjb25zZXF1YXR1ci4gUXVpcyBhdXRlIGl1cmUgcmVwcmVoZW5kZXJpdCBpbiB2b2x1cHRhdGUgdmVsaXQgZXNzZSBjaWxsdW0gZG9sb3JlIGV1IGZ1Z2lhdCBudWxsYSBwYXJpYXR1ci4gRXhjZXB0ZXVyIHNpbnQgb2JjYWVjYXQgY3VwaWRpdGF0IG5vbiBwcm9pZGVudCwgc3VudCBpbiBjdWxwYSBxdWkgb2ZmaWNpYSBkZXNlcnVudCBtb2xsaXQgYW5pbSBpZCBlc3QgbGFib3J1bS4K';

const P12Password = 'password';

const P12FieldName = 'pkcs12';
const P12PasswdField = 'pwd';

describe('P12ValidatorRule', () => {
  it('should return valid', () => {
    const config = {
      type: NAME,
      password_field: P12PasswdField
    };

    const rule = ValidationRule.forRule(config);
    const result = rule.validate({ [P12FieldName]: P12, [P12PasswdField]: P12Password }, P12FieldName);
    expect(result).toEqual({ valid: true });
  });

  it('should return invalid password', () => {
    const config = {
      type: NAME,
      password_field: P12PasswdField
    };

    const rule = ValidationRule.forRule(config);
    const result = rule.validate({ [P12FieldName]: P12, [P12PasswdField]: '123' }, P12FieldName);
    expect(result).toEqual({ valid: false, error: 'PKCS#12 MAC could not be verified. Invalid password?' });
  });

  it('should return no PK12 file error', () => {
    const config = {
      type: NAME,
      password_field: P12PasswdField
    };

    const rule = ValidationRule.forRule(config);
    const result = rule.validate({ [P12FieldName]: WRONGB64ENCODEDFILE, [P12PasswdField]: '123' }, P12FieldName);
    expect(result).toEqual({ valid: false, error: 'Cannot read PKCS#12 PFX. ASN.1 object is not an PKCS#12 PFX.' });
  });

  it('should return custom error', () => {
    const config = {
      type: NAME,
      password_field: P12PasswdField,
      error: 'My Custom Error Message'
    };

    const rule = ValidationRule.forRule(config);
    const result = rule.validate({ [P12FieldName]: WRONGB64ENCODEDFILE, [P12PasswdField]: '123' }, P12FieldName);
    expect(result).toEqual({ valid: false, error: 'My Custom Error Message' });
  });

  it('should return BAD P12 or Wrong password (custom message)', () => {
    const config = {
      type: NAME,
      password_field: P12PasswdField,
      error: { 'Cannot read PKCS#12 PFX. ASN.1 object is not an PKCS#12 PFX.': 'BAD P12 or Wrong password' }
    };

    const rule = ValidationRule.forRule(config);
    const result = rule.validate({ [P12FieldName]: WRONGB64ENCODEDFILE, [P12PasswdField]: '123' }, P12FieldName);
    expect(result).toEqual({ valid: false, error: 'BAD P12 or Wrong password' });
  });
});
