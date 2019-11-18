import { CustomResource } from './customresource';
import './datasync.css';

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
        },
        syncServerConfig: {
          url: {
            'ui:description': 'The URL of the data sync server, including protocol and hostname.',
            'ui:placeholder': 'https://datasync.example.com'
          },
          graphqlEndpoint: {
            'ui:description':
              "The Graphql endpoint of the data sync server, starts with '/'. You shouldn't need to change this value in most of the cases."
          }
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
                  },
                  {
                    type: 'regexp',
                    regexp: /^https?:\/\/.{1}/,
                    error: "URL is not valid. It should start with 'http' or 'https' and have a valid hostname."
                  }
                ]
              },
              graphqlEndpoint: {
                validation_rules: [
                  {
                    type: 'required',
                    error: 'Data Sync Server GraphQL endpoint is required'
                  },
                  {
                    type: 'regexp',
                    regexp: /^\//,
                    error: "Endpoint should start with '/'"
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
        name: `${CLIENT_ID}-data-sync-binding`
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
