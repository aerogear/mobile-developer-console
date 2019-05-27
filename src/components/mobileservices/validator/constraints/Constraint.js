import { NAME as FIELD_VALUE, FieldValueConstraint } from './FieldValueConstraint';

/**
 * Factory for the constraints.
 */
export class Constraint {
  static forConfig(config) {
    switch (config.type) {
      case FIELD_VALUE:
        return new FieldValueConstraint(config);
      default:
        return null;
    }
  }
}
