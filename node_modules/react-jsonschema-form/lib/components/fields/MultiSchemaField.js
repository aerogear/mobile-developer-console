"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getIterator2 = require("babel-runtime/core-js/get-iterator");

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _extends2 = require("babel-runtime/helpers/extends");

var _extends3 = _interopRequireDefault(_extends2);

var _assign = require("babel-runtime/core-js/object/assign");

var _assign2 = _interopRequireDefault(_assign);

var _objectWithoutProperties2 = require("babel-runtime/helpers/objectWithoutProperties");

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

var _keys = require("babel-runtime/core-js/object/keys");

var _keys2 = _interopRequireDefault(_keys);

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

var _propTypes = require("prop-types");

var _propTypes2 = _interopRequireDefault(_propTypes);

var _types = require("../../types");

var types = _interopRequireWildcard(_types);

var _utils = require("../../utils");

var _validate = require("../../validate");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var AnyOfField = function (_Component) {
  (0, _inherits3.default)(AnyOfField, _Component);

  function AnyOfField(props) {
    (0, _classCallCheck3.default)(this, AnyOfField);

    var _this = (0, _possibleConstructorReturn3.default)(this, (AnyOfField.__proto__ || (0, _getPrototypeOf2.default)(AnyOfField)).call(this, props));

    _initialiseProps.call(_this);

    var _this$props = _this.props,
        formData = _this$props.formData,
        options = _this$props.options;


    _this.state = {
      selectedOption: _this.getMatchingOption(formData, options)
    };
    return _this;
  }

  (0, _createClass3.default)(AnyOfField, [{
    key: "componentWillReceiveProps",
    value: function componentWillReceiveProps(nextProps) {
      var matchingOption = this.getMatchingOption(nextProps.formData, nextProps.options);

      if (matchingOption === this.state.selectedOption) {
        return;
      }

      this.setState({ selectedOption: matchingOption });
    }
  }, {
    key: "getMatchingOption",
    value: function getMatchingOption(formData, options) {
      for (var i = 0; i < options.length; i++) {
        var option = options[i];

        // If the schema describes an object then we need to add slightly more
        // strict matching to the schema, because unless the schema uses the
        // "requires" keyword, an object will match the schema as long as it
        // doesn't have matching keys with a conflicting type. To do this we use an
        // "anyOf" with an array of requires. This augmentation expresses that the
        // schema should match if any of the keys in the schema are present on the
        // object and pass validation.
        if (option.properties) {
          // Create an "anyOf" schema that requires at least one of the keys in the
          // "properties" object
          var requiresAnyOf = {
            anyOf: (0, _keys2.default)(option.properties).map(function (key) {
              return {
                required: [key]
              };
            })
          };

          var augmentedSchema = void 0;

          // If the "anyOf" keyword already exists, wrap the augmentation in an "allOf"
          if (option.anyOf) {
            // Create a shallow clone of the option
            var shallowClone = (0, _objectWithoutProperties3.default)(option, []);


            if (!shallowClone.allOf) {
              shallowClone.allOf = [];
            } else {
              // If "allOf" already exists, shallow clone the array
              shallowClone.allOf = shallowClone.allOf.slice();
            }

            shallowClone.allOf.push(requiresAnyOf);

            augmentedSchema = shallowClone;
          } else {
            augmentedSchema = (0, _assign2.default)({}, option, requiresAnyOf);
          }

          // Remove the "required" field as it's likely that not all fields have
          // been filled in yet, which will mean that the schema is not valid
          delete augmentedSchema.required;

          if ((0, _validate.isValid)(augmentedSchema, formData)) {
            return i;
          }
        } else if ((0, _validate.isValid)(options[i], formData)) {
          return i;
        }
      }

      // If the form data matches none of the options, use the first option
      return 0;
    }
  }, {
    key: "render",
    value: function render() {
      var _props = this.props,
          baseType = _props.baseType,
          disabled = _props.disabled,
          errorSchema = _props.errorSchema,
          formData = _props.formData,
          idPrefix = _props.idPrefix,
          idSchema = _props.idSchema,
          onBlur = _props.onBlur,
          onChange = _props.onChange,
          onFocus = _props.onFocus,
          options = _props.options,
          registry = _props.registry,
          safeRenderCompletion = _props.safeRenderCompletion,
          uiSchema = _props.uiSchema;


      var _SchemaField = registry.fields.SchemaField;
      var widgets = registry.widgets;
      var selectedOption = this.state.selectedOption;

      var _getUiOptions = (0, _utils.getUiOptions)(uiSchema),
          _getUiOptions$widget = _getUiOptions.widget,
          widget = _getUiOptions$widget === undefined ? "select" : _getUiOptions$widget,
          uiOptions = (0, _objectWithoutProperties3.default)(_getUiOptions, ["widget"]);

      var Widget = (0, _utils.getWidget)({ type: "number" }, widget, widgets);

      var option = options[selectedOption] || null;
      var optionSchema = void 0;

      if (option) {
        // If the subschema doesn't declare a type, infer the type from the
        // parent schema
        optionSchema = option.type ? option : (0, _assign2.default)({}, option, { type: baseType });
      }

      var enumOptions = options.map(function (option, index) {
        return {
          label: option.title || "Option " + (index + 1),
          value: index
        };
      });

      return _react2.default.createElement(
        "div",
        { className: "panel panel-default panel-body" },
        _react2.default.createElement(
          "div",
          { className: "form-group" },
          _react2.default.createElement(Widget, (0, _extends3.default)({
            id: idSchema.$id + "_anyof_select",
            schema: { type: "number", default: 0 },
            onChange: this.onOptionChange,
            onBlur: onBlur,
            onFocus: onFocus,
            value: selectedOption,
            options: { enumOptions: enumOptions }
          }, uiOptions))
        ),
        option !== null && _react2.default.createElement(_SchemaField, {
          schema: optionSchema,
          uiSchema: uiSchema,
          errorSchema: errorSchema,
          idSchema: idSchema,
          idPrefix: idPrefix,
          formData: formData,
          onChange: onChange,
          onBlur: onBlur,
          onFocus: onFocus,
          registry: registry,
          safeRenderCompletion: safeRenderCompletion,
          disabled: disabled
        })
      );
    }
  }]);
  return AnyOfField;
}(_react.Component);

var _initialiseProps = function _initialiseProps() {
  var _this2 = this;

  this.onOptionChange = function (option) {
    var selectedOption = parseInt(option, 10);
    var _props2 = _this2.props,
        formData = _props2.formData,
        onChange = _props2.onChange,
        options = _props2.options;


    var newOption = options[selectedOption];

    // If the new option is of type object and the current data is an object,
    // discard properties added using the old option.
    if ((0, _utils.guessType)(formData) === "object" && (newOption.type === "object" || newOption.properties)) {
      var newFormData = (0, _assign2.default)({}, formData);

      var optionsToDiscard = options.slice();
      optionsToDiscard.splice(selectedOption, 1);

      // Discard any data added using other options
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = (0, _getIterator3.default)(optionsToDiscard), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var _option = _step.value;

          if (_option.properties) {
            for (var key in _option.properties) {
              if (newFormData.hasOwnProperty(key)) {
                delete newFormData[key];
              }
            }
          }
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      onChange(newFormData);
    } else {
      onChange(undefined);
    }

    _this2.setState({
      selectedOption: parseInt(option, 10)
    });
  };
};

AnyOfField.defaultProps = {
  disabled: false,
  errorSchema: {},
  idSchema: {},
  uiSchema: {}
};

if (process.env.NODE_ENV !== "production") {
  AnyOfField.propTypes = {
    options: _propTypes2.default.arrayOf(_propTypes2.default.object).isRequired,
    baseType: _propTypes2.default.string,
    uiSchema: _propTypes2.default.object,
    idSchema: _propTypes2.default.object,
    formData: _propTypes2.default.any,
    errorSchema: _propTypes2.default.object,
    registry: types.registry.isRequired
  };
}

exports.default = AnyOfField;