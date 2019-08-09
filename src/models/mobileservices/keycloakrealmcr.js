import { CustomResource } from './customresource';

export class KeycloakRealmCR extends CustomResource {
  constructor(data = {}) {
    super(data);
  }

  getConfiguration(serviceHost) {
    const realmId = this.spec.get('realm');
    return [
      { type: 'string', label: 'Keycloak Realm', value: realmId },
      { type: 'href', label: 'Service Host', value: serviceHost },
      {
        type: 'href',
        label: 'Keycloak Realm URL',
        value: `${serviceHost}/auth/admin/${realmId}/console/#/realms/${realmId}`
      }
    ];
  }

  static bindForm(params) {
    return {
      schema: {
        additionalProperties: false,
        properties: {
          CLIENT_ID: {
            title: 'Mobile App ID',
            type: 'string',
            default: params.appName
          },
          realmSettings: {
            type: 'object',
            title: 'Realm Settings',
            properties: {
              realmId: {
                title: 'Realm Id',
                type: 'string',
                default: `${params.appName}-realm`
              },
              adminUsername: {
                title: 'Admin User name',
                type: 'string'
              },
              adminPassword: {
                title: 'Admin User password',
                type: 'string'
              }
            }
          },
          clientSettings: {
            type: 'object',
            title: 'Client Settings',
            properties: {
              clientId: {
                title: 'Client Id',
                type: 'string',
                default: `${params.appName}-client`
              },
              CLIENT_TYPE: {
                default: 'public',
                title: 'Client type',
                type: 'string'
              }
            }
          }
        },
        type: 'object'
      },
      uiSchema: {
        CLIENT_ID: {
          'ui:widget': 'hidden'
        },
        clientSettings: {
          clientId: {
            'ui:readonly': true
          },
          CLIENT_TYPE: {
            'ui:widget': 'hidden'
          }
        },
        realmSettings: {
          adminPassword: {
            'ui:widget': 'password'
          }
        }
      },
      validationRules: {
        IDM_BINDING: {
          comment: 'This is the set of rules that will be used to validate IDM bindings',
          fields: {
            realmSettings: {
              realmId: {
                validation_rules: [
                  {
                    type: 'maxlength',
                    length: 36
                  }
                ]
              },
              adminUsername: {
                validation_rules: [
                  {
                    type: 'required',
                    error: 'Admin username is required'
                  }
                ]
              },
              adminPassword: {
                validation_rules: [
                  {
                    type: 'required',
                    error: 'Admin password is required'
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
    const { CLIENT_ID } = params;
    const { realmId, adminUsername, adminPassword } = params.realmSettings;
    const { clientId, CLIENT_TYPE } = params.clientSettings;
    return {
      apiVersion: 'aerogear.org/v1alpha1',
      kind: 'KeycloakRealm',
      metadata: {
        name: realmId,
        labels: {
          'mobile.aerogear.org/client': CLIENT_ID
        }
      },
      spec: {
        id: realmId,
        realm: realmId,
        displayName: `Realm for mobile app ${CLIENT_ID}`,
        enabled: true,
        createOnly: true,
        clients: [
          {
            name: clientId,
            clientId,
            publicClient: CLIENT_TYPE === 'public',
            bearerOnly: CLIENT_TYPE === 'bearer',
            webOrigins: ['http://localhost:8100', '*'],
            redirectUris: ['http://localhost*'],
            standardFlowEnabled: true,
            enabled: true,
            outputSecret: `${clientId}-install-config`,
            clientAuthenticatorType: 'client-secret',
            fullScopeAllowed: true,
            nodeReRegistrationTimeout: -1
          }
        ],
        users: [
          {
            username: adminUsername,
            password: adminPassword,
            outputSecret: `${params.CLIENT_ID}-admin-pass`,
            enabled: true,
            emailVerified: false,
            firstName: '',
            lastName: '',
            email: '',
            realmRoles: ['offline_access', 'uma_authorization'],
            clientRoles: {
              account: ['manage-account', 'view-profile'],
              'realm-management': ['realm-admin']
            }
          }
        ]
      }
    };
  }

  static getDocumentationUrl() {
    return 'https://docs.aerogear.org/external/apb/keycloak.html';
  }
}
