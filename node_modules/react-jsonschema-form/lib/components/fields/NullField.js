"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

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

var _types = require("../../types");

var types = _interopRequireWildcard(_types);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var NullField = function (_Component) {
  (0, _inherits3.default)(NullField, _Component);

  function NullField() {
    (0, _classCallCheck3.default)(this, NullField);
    return (0, _possibleConstructorReturn3.default)(this, (NullField.__proto__ || (0, _getPrototypeOf2.default)(NullField)).apply(this, arguments));
  }

  (0, _createClass3.default)(NullField, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      if (this.props.formData === undefined) {
        this.props.onChange(null);
      }
    }
  }, {
    key: "render",
    value: function render() {
      return null;
    }
  }]);
  return NullField;
}(_react.Component);

if (process.env.NODE_ENV !== "production") {
  NullField.propTypes = types.fieldProps;
}

exports.default = NullField;