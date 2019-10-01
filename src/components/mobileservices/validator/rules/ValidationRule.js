import { NAME as REQUIRED, RequiredRule } from './RequiredRule';
import { NAME as SAMEVALUEOF, SameValueOfRule } from './SameValueOfRule';
import { NAME as P12VALIDATOR, P12ValidationRule } from './P12ValidatorRule';
import { NAME as REGEXP, RegExpRule } from './RegExpRule';
import { NAME as MAXLENGTH, MaxLengthRule } from './MaxLengthRule';
import { NAME as IS_EMAIL, ValidEmailRule } from './ValidEmailRule';
import { NAME as IS_MAILTO, ValidMailToRule } from './ValidMailToRule';
import { NAME as IS_URL, ValidUrlRule } from './ValidUrlRule';
import { NAME as COMPOSITE, CompositeRule } from './CompositeRule';
import { NoopRule } from './NoopRule';

/**
 * Rules factory.
 */
export class ValidationRule {
  static forRule(ruleConfig) {
    const { type: ruleType } = ruleConfig;

    switch (ruleType) {
      case COMPOSITE: {
        return new CompositeRule(ruleConfig);
      }
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
      case IS_EMAIL: {
        return new ValidEmailRule(ruleConfig);
      }
      case IS_MAILTO: {
        return new ValidMailToRule(ruleConfig);
      }
      case IS_URL: {
        return new ValidUrlRule(ruleConfig);
      }
      default: {
        return new NoopRule();
      }
    }
  }
}
