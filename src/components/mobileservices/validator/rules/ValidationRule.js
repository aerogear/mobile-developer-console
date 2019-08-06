import { NAME as REQUIRED, RequiredRule } from './RequiredRule';
import { NAME as SAMEVALUEOF, SameValueOfRule } from './SameValueOfRule';
import { NAME as P12VALIDATOR, P12ValidationRule } from './P12ValidatorRule';
import { NAME as REGEXP, RegExpRule } from './RegExpRule';
import { NAME as MAXLENGTH, MaxLengthRule } from './MaxLengthRule';
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
      case SAMEVALUEOF: {
        return new SameValueOfRule(ruleConfig);
      }
      case P12VALIDATOR: {
        return new P12ValidationRule(ruleConfig);
      }
      case REGEXP: {
        return new RegExpRule(ruleConfig);
      }
      case MAXLENGTH: {
        return new MaxLengthRule(ruleConfig);
      }
      default: {
        return new NoopRule();
      }
    }
  }
}
