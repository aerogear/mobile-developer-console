import { CustomResource } from './customresource';

export class MobileSecurityServiceAppCR extends CustomResource {
  constructor(data = {}) {
    super(data);
  }

  // eslint-disable-next-line class-methods-use-this
  isReady() {
    return true;
  }

  // eslint-disable-next-line class-methods-use-this
  getConfiguration(serviceHost) {
    return [
      {
        type: 'href',
        label: 'Mobile Security Service URL',
        value: serviceHost
      }
    ];
  }

  static bindForm(params) {
    return {
      schema: {
        additionalProperties: false,
        properties: {
          appName: {
            title: 'Mobile Client ID',
            type: 'string',
            default: params.appName
          },
          appConfig: {
            type: 'object',
            title: 'App Configuration',
            properties: {
              appId: {
                title: 'Unique App Identifier',
                type: 'string'
              }
            }
          }
        },
        type: 'object'
      },
      uiSchema: {
        appName: {
          'ui:readonly': true
        },
        appConfig: {
          appId: {
            'ui:description':
              'The unique identifier for your app. This is the bundle ID on iOS and application ID on Android.',
            'ui:placeholder': 'com.example.myapp'
          }
        }
      },
      validationRules: {
        MOBILE_SECURITY_BINDING: {
          comment: 'This is the set of rules that will be used to validate MOBILE_SECURITY bindings',
          fields: {
            appConfig: {
              appId: {
                validation_rules: [
                  {
                    type: 'required',
                    error: 'Unique identifier is required.'
                  },
                  {
                    type: 'maxlength',
                    length: 255,
                    error: 'Unique identifer is too long. Maximum length allowed is 255 characters.'
                  },
                  {
                    type: 'regexp',
                    regexp: /^[-a-zA-Z][a-zA-Z0-9_]*(\.[-a-zA-Z]+[-a-zA-Z0-9_]*[^.]?)+$/,
                    error:
                      'Unique identifier must have at least two segments separated by dots (.). Each segment must start with a letter, hyphen or underscore. Valid characters: [a-zA-Z0-9_-].'
                  }
                ]
              }
            }
          }
        }
      }
    };
  }

  static newInstance({ appName, appUid, appConfig: { appId } }) {
    return {
      apiVersion: 'mobile-security-service.aerogear.org/v1alpha1',
      kind: 'MobileSecurityServiceApp',
      metadata: {
        name: `${appName}-security`,
        labels: {
          'mobile.aerogear.org/client': appUid
        }
      },
      spec: {
        appName,
        appId
      }
    };
  }

  static getDocumentationUrl() {
    return 'https://docs.aerogear.org/aerogear/latest/security.html#app-security';
  }
}
