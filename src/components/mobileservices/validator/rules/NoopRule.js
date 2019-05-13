/* eslint class-methods-use-this: 0 */
export class NoopRule {
  constructor(config) {
    this.config = config;
  }

  validate() {
    return { valid: true };
  }
}
