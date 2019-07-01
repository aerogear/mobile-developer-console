import { CustomResource } from './customresource';

export class PushApplicationCR extends CustomResource {
  constructor(data = {}) {
    super(data);
  }

  getPlatform() {
    // TODO: fix me!!
    return this.spec.get('platform');
  }

  getConfiguration(serviceHost) {}

  static bindForm(params) {}

  static newInstance(params) {
    const { name } = params;

    return {
      apiVersion: 'push.aerogear.org/v1alpha1',
      kind: 'PushApplication',
      metadata: {
        name
      },
      spec: {
        description: 'MDC Push Application'
      }
    };
  }

  static getDocumentationUrl() {
    return 'https://docs.aerogear.org/external/apb/unifiedpush.html';
  }
}
