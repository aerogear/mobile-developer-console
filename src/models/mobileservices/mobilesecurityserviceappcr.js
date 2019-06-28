import { CustomResource } from './customresource';

export class MobileSecurityServiceAppCR extends CustomResource {
  constructor(data = {}) {
    super(data);
  }

  // eslint-disable-next-line class-methods-use-this
  isReady() {
    return true;
  }

  getConfiguration() {
    const appId = this.get('data.appId');
    return [
      {
        type: 'string',
        label: 'App ID',
        value: appId
      }
    ];
  }

  static bindForm(params) {
    return {
      schema: {
        additionalProperties: false,
        properties: {
          appName: {
            title: 'App Name',
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
        APP_SECURITY_BINDING: {
          comment: 'This is the set of rules that will be used to validate APP_SECURITY bindings',
          fields: {
            appConfig: {
              appId: {
                validation_rules: [
                  {
                    type: 'required',
                    error: 'Unique identifier is required.'
                  },
                  {
                    type: 'regexp',
                    regexp: /^(?:[-a-zA-Z]+(?:\d*[a-zA-Z_]*)*)(?:\.[-a-zA-Z]+(?:\d*[a-zA-Z_]*)*)+$/,
                    error:
                      'Unique identifier must have at least two segments separated by dots (.). Each segment must start with a letter or a hyphen. Valid characters: [a-zA-Z0-9_-].'
                  }
                ]
              }
            }
          }
        }
      }
    };
  }

  static newInstance({ appName, appConfig: { appId } }) {
    return {
      apiVersion: 'mobile-security-service.aerogear.com/v1alpha1',
      kind: 'MobileSecurityServiceApp',
      metadata: {
        name: `${appName}-security`,
        namespace: 'mobile-security-service-apps',
        labels: {
          'mobile.aerogear.org/client': appName
        }
      },
      spec: {
        appName,
        appId
      }
    };
  }

  static getDocumentationUrl() {
    // TODO: Replace with direct link to documentation when documentation is published
    return 'https://docs.aerogear.org';
  }
}
