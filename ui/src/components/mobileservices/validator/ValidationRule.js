import { RequiredRule } from './rules/RequiredRule';
import { NoopRule } from './rules/NoopRule';

/**
 * Rules factory.
 */
export class ValidationRule {
  static forRule(ruleConfig) {
    const { type: ruleType } = ruleConfig;

    switch (ruleType) {
      case 'required': {
        return new RequiredRule(ruleConfig);
      }
      default: {
        return new NoopRule();
      }
    }
  }
}
