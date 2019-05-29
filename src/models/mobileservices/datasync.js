import { CustomResource } from './customresource';

export class DataSyncCR extends CustomResource {
  constructor(data = {}) {
    super(data);
  }

  // eslint-disable-next-line class-methods-use-this
  isReady() {
    return true;
  }

  getConfiguration() {
    const syncServerUrl = this.get('data.syncServerUrl');
    return [
      {
        type: 'href',
        label: 'Data Sync Server URL',
        value: `${syncServerUrl}`
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
          syncServerConfig: {
            title: 'Data Sync Server Config',
            type: 'object',
            properties: {
              url: {
                title: 'Server URL',
                type: 'string'
              },
              graphqlEndpoint: {
                title: 'GraphQL Endpoint',
                type: 'string',
                default: '/graphql'
              }
            }
          }
        },
        type: 'object'
      },
      uiSchema: {
        CLIENT_ID: {
          'ui:widget': 'hidden'
        }
      },
      validationRules: {
        DATA_SYNC_BINDING: {
          comment: 'This is the set of rules that will be used to validate DATA_SYNC bindings',
          fields: {
            syncServerConfig: {
              url: {
                validation_rules: [
                  {
                    type: 'required',
                    error: 'Data Sync Server URL is required'
                  }
                ]
              },
              graphqlEndpoint: {
                validation_rules: [
                  {
                    type: 'required',
                    error: 'Data Sync Server GraphQL endpoint is required'
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
    const { url, graphqlEndpoint } = params.syncServerConfig;
    return {
      apiVersion: 'v1',
      kind: 'ConfigMap',
      metadata: {
        name: `${CLIENT_ID}-data-sync-binding`,
        labels: {
          'mobile.aerogear.org/client': CLIENT_ID
        }
      },
      data: {
        syncServerUrl: url,
        graphqlEndpoint
      }
    };
  }

  static getDocumentationUrl() {
    return 'https://docs.aerogear.org/aerogear/latest/data-sync.html';
  }
}
