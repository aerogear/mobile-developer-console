import { CustomResource } from './customresource';

export class MetricsCR extends CustomResource {
  getConfiguration() {
    const metricsUrl = this.spec.get('metricsUrl');
    const grafanaUrl = this.spec.get('grafanaUrl');
    return [
      { type: 'href', label: 'Metrics Endpoint', value: metricsUrl },
      {
        type: 'href',
        label: 'Grafana URL',
        value: grafanaUrl
      }
    ];
  }

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

  static getDocumentationUrl() {
    return 'https://docs.aerogear.org/external/apb/metrics.html';
  }
}
