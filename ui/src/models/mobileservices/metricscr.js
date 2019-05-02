import { CustomResource } from './customresource';

export class MetricsCR extends CustomResource {
  static bindForm(params) {
    return {
      schema: {
        additionalProperties: false,
        properties: {
          CLIENT_ID: {
            title: 'Mobile Client ID',
            type: 'string',
            default: params.appName
          }
        },
        type: 'object'
      },
      uiSchema: {
        CLIENT_ID: {
          'ui:readonly': true
        }
      }
    };
  }

  static newInstance(params) {
    // TODO: implement me
    return {};
  }
}
