import { find } from 'lodash-es';
import { CustomResource } from './customresource';

function hasPlatform(service, platform) {
  return (
    service.customResources &&
    find(service.customResources, cr => typeof cr.getPlatform === 'function' && cr.getPlatform() === platform)
  );
}

export class PushVariantCR extends CustomResource {
  constructor(data = {}) {
    super(data);
  }

  getPlatform() {
    // TODO: fix me!!
    return this.spec.get('platform');
  }

  static bindForm(params) {
    const { service } = params;
    const hasIOS = hasPlatform(service, 'ios');
    const hasAndroid = hasPlatform(service, 'android');
    let defaultPlatform = 'Android';
    let platforms = ['Android', 'iOS'];
    const androidConfig = {
      title: 'Android',
      type: 'object',
      properties: {
        googlekey: {
          title: 'Your Server Key for Firebase Cloud Messaging',
          type: 'string'
        },
        projectNumber: {
          title: 'Your Sender ID, needed to connecting to FCM',
          type: 'string'
        }
      }
    };
    const iosConfig = {
      type: 'object',
      title: 'iOS',
      properties: {
        cert: {
          title: 'iOS .p12 file (encode contents in base64 before pasting)',
          type: 'string'
        },
        passphrase: {
          title: 'The passphrase',
          type: 'string'
        },
        iosIsProduction: {
          default: false,
          title: 'Is this a production certificate?',
          type: 'boolean'
        }
      }
    };
    let platformConfig = androidConfig;
    if (hasIOS && hasAndroid) {
      platforms = [];
      defaultPlatform = '';
    } else if (hasIOS) {
      defaultPlatform = 'Android';
      platforms = ['Android'];
      platformConfig = androidConfig;
    } else if (hasAndroid) {
      defaultPlatform = 'iOS';
      platforms = ['iOS'];
      platformConfig = iosConfig;
    }
    const schema = {
      additionalProperties: false,
      properties: {
        CLIENT_ID: {
          title: 'Mobile Client ID',
          type: 'string',
          default: params.appName
        },
        CLIENT_TYPE: {
          default: defaultPlatform,
          enum: platforms,
          title: 'Mobile Client Type',
          type: 'string'
        },
        platformConfig
      },
      type: 'object'
    };
    return {
      schema,
      uiSchema: {
        CLIENT_ID: {
          'ui:readonly': true
        },
        platformConfig: {
          // TODO: should change this to a file field and extract the content automatically
          cert: {
            'ui:widget': 'textarea'
          },
          passphrase: {
            'ui:widget': 'password'
          }
        }
      },
      onChangeHandler(formData, oldSchema) {
        const s = oldSchema;
        if (oldSchema.properties.platformConfig.title === 'Android' && formData.CLIENT_TYPE === 'iOS') {
          delete s.properties.platformConfig;
          s.properties.CLIENT_TYPE.default = 'iOS';
          s.properties.platformConfig = iosConfig;
        } else if (oldSchema.properties.platformConfig.title === 'iOS' && formData.CLIENT_TYPE === 'Android') {
          delete s.properties.platformConfig;
          s.properties.CLIENT_TYPE.default = 'Android';
          s.properties.platformConfig = androidConfig;
        }
        return s;
      },
      validationRules: {
        UPSCOMMON: {
          comment: 'This set of rules is always executed when service is UPS. It is used to validate common fields.',
          fields: {
            CLIENT_ID: {
              validation_rules: [
                {
                  type: 'required'
                }
              ]
            },
            CLIENT_TYPE: {
              validation_rules: [
                {
                  type: 'required'
                }
              ]
            }
          }
        },
        IOS_UPS_BINDING: {
          comment: 'This is the set of rules that will be used to validate IOS UPS Binding.',
          executionConstraints: [
            {
              comment: "Execute this ruleset only when the field named 'CLIENT_TYPE' has value 'IOS'",
              type: 'FIELD_VALUE',
              name: 'CLIENT_TYPE',
              value: 'iOS'
            }
          ],
          fields: {
            platformConfig: {
              cert: {
                comment: "Errors relative to this field should be bound to the key 'iosIsProduction'",
                validation_rules: [
                  {
                    type: 'required',
                    error: 'APNS requires a certificate.'
                  },
                  {
                    type: 'P12VALIDATOR',
                    error: 'Invalid PKCS#12 data or bad password',
                    password_field: 'platformConfig.passphrase'
                  }
                ]
              },
              passphrase: {
                validation_rules: [
                  {
                    type: 'required',
                    error: 'APNS certificate passphrase is required.'
                  }
                ]
              }
            }
          }
        },
        ANDROID_UPS_BINDING: {
          comment: 'This is the set of rules that will be used to validate Android UPS Binding.',
          executionConstraints: [
            {
              comment: "Execute this ruleset only when the field named 'CLIENT_TYPE' has value 'Android'",
              type: 'FIELD_VALUE',
              name: 'CLIENT_TYPE',
              value: 'Android'
            }
          ],
          fields: {
            platformConfig: {
              googlekey: {
                validation_rules: [
                  {
                    type: 'required',
                    error: 'FCM requires a Server Key.'
                  }
                ]
              },
              projectNumber: {
                validation_rules: [
                  {
                    type: 'required',
                    error: 'FCM requires a Sender ID..'
                  }
                ]
              }
            }
          }
        }
      }
    };
  }

  static newInstance(params) {
    // TODO: implement me!
    return {};
  }
}
