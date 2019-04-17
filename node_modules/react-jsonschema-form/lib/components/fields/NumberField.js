"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require("babel-runtime/helpers/extends");

var _extends3 = _interopRequireDefault(_extends2);

var _objectWithoutProperties2 = require("babel-runtime/helpers/objectWithoutProperties");

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

var _getPrototypeOf = require("babel-runtime/core-js/object/get-prototype-of");

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require("babel-runtime/helpers/possibleConstructorReturn");

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require("babel-runtime/helpers/inherits");

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _types = require("../../types");

var types = _interopRequireWildcard(_types);

var _utils = require("../../utils");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Matches a string that ends in a . character, optionally followed by a sequence of
// digits followed by any number of 0 characters up until the end of the line.
// Ensuring that there is at least one prefixed character is important so that
// you don't incorrectly match against "0".
var trailingCharMatcherWithPrefix = /\.([0-9]*0)*$/;

// This is used for trimming the trailing 0 and . characters without affecting
// the rest of the string. Its possible to use one RegEx with groups for this
// functionality, but it is fairly complex compared to simply defining two
// different matchers.
var trailingCharMatcher = /[0.]0*$/;

/**
 * The NumberField class has some special handling for dealing with trailing
 * decimal points and/or zeroes. This logic is designed to allow trailing values
 * to be visible in the input element, but not be represented in the
 * corresponding form data.
 *
 * The algorithm is as follows:
 *
 * 1. When the input value changes the value is cached in the component state
 *
 * 2. The value is then normalized, removing trailing decimal points and zeros,
 *    then passed to the "onChange" callback
 *
 * 3. When the component is rendered, the formData value is checked against the
 *    value cached in the state. If it matches the cached value, the cached
 *    value is passed to the input instead of the formData value
 */

var NumberField = function (_React$Component) {
  (0, _inherits3.default)(NumberField, _React$Component);

  function NumberField(props) {
    (0, _classCallCheck3.default)(this, NumberField);

    var _this = (0, _possibleConstructorReturn3.default)(this, (NumberField.__proto__ || (0, _getPrototypeOf2.default)(NumberField)).call(this, props));

    _this.handleChange = function (value) {
      // Cache the original value in component state
      _this.setState({ lastValue: value });

      // Normalize decimals that don't start with a zero character in advance so
      // that the rest of the normalization logic is simpler
      if (("" + value).charAt(0) === ".") {
        value = "0" + value;
      }

      // Check that the value is a string (this can happen if the widget used is a
      // <select>, due to an enum declaration etc) then, if the value ends in a
      // trailing decimal point or multiple zeroes, strip the trailing values
      var processed = typeof value === "string" && value.match(trailingCharMatcherWithPrefix) ? (0, _utils.asNumber)(value.replace(trailingCharMatcher, "")) : (0, _utils.asNumber)(value);

      _this.props.onChange(processed);
    };

    _this.state = {
      lastValue: props.value
    };
    return _this;
  }

  (0, _createClass3.default)(NumberField, [{
    key: "render",
    value: function render() {
      var StringField = this.props.registry.fields.StringField;
      var _props = this.props,
          formData = _props.formData,
          props = (0, _objectWithoutProperties3.default)(_props, ["formData"]);
      var lastValue = this.state.lastValue;


      var value = formData;

      if (typeof lastValue === "string" && value) {
        // Construct a regular expression that checks for a string that consists
        // of the formData value suffixed with zero or one '.' characters and zero
        // or more '0' characters
        var re = new RegExp(("" + value).replace(".", "\\.") + "\\.?0*$");

        // If the cached "lastValue" is a match, use that instead of the formData
        // value to prevent the input value from changing in the UI
        if (lastValue.match(re)) {
          value = lastValue;
        }
      }

      return _react2.default.createElement(StringField, (0, _extends3.default)({}, props, { formData: value, onChange: this.handleChange }));
    }
  }]);
  return NumberField;
}(_react2.default.Component);

if (process.env.NODE_ENV !== "production") {
  NumberField.propTypes = types.fieldProps;
}

NumberField.defaultProps = {
  uiSchema: {}
};

exports.default = NumberField;