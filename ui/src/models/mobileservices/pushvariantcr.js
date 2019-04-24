import { CustomResource } from './customresource';

export class PushVariantCR extends CustomResource {
  constructor(data = {}) {
    super(data);
  }

  getPlatform() {
    // TODO: fix me!!
    return this.spec.get('platform');
  }
}
