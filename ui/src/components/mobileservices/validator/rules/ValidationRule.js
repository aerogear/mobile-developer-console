import { NAME as REQUIRED, RequiredRule } from './RequiredRule';
import { NoopRule } from './NoopRule';

/**
 * Rules factory.
 */
export class ValidationRule {
  static forRule(ruleConfig) {
    const { type: ruleType } = ruleConfig;

    switch (ruleType) {
      case REQUIRED: {
        return new RequiredRule(ruleConfig);
      }
      default: {
        return new NoopRule();
      }
    }
  }
}
