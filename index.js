"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var React = _interopRequireWildcard(require("react"));

var _utils = require("./utils");

require("intersection-observer");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var IntersectionTarget =
/*#__PURE__*/
function (_React$Component) {
  _inherits(IntersectionTarget, _React$Component);

  function IntersectionTarget(props) {
    var _this;

    _classCallCheck(this, IntersectionTarget);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(IntersectionTarget).call(this, props));
    _this.targetElem = null;
    _this.observer = null;
    _this.errorMsg = 'Target element is missing to be observed. Be sure, you did not mutate it.';
    return _this;
  }

  _createClass(IntersectionTarget, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.observeIntersection();
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps) {
      var isOptionsChanged = (0, _utils.checkOptionsChanged)(prevProps.options, this.props.options);

      if (isOptionsChanged && this.observer && this.observer.unobserve) {
        if (!this.targetElem) {
          throw new Error(this.errorMsg);
        }

        this.observer.unobserve(this.targetElem);
        this.observeIntersection();
      }
    }
  }, {
    key: "setTargetElem",
    value: function setTargetElem() {
      var _this2 = this;

      return function (elem) {
        _this2.targetElem = elem;
      };
    }
  }, {
    key: "observeIntersection",
    value: function observeIntersection() {
      if (!this.targetElem) {
        throw new Error(this.errorMsg);
      }

      var _this$props = this.props,
          onIntersect = _this$props.onIntersect,
          onEnter = _this$props.onEnter,
          onLeave = _this$props.onLeave,
          _this$props$options = _this$props.options,
          options = _this$props$options === void 0 ? {} : _this$props$options;
      var callbacks = {
        onIntersect: onIntersect,
        onEnter: onEnter,
        onLeave: onLeave
      };
      var optionsFilled = (0, _utils.validateOptions)(options);
      this.observer = new IntersectionObserver(this.handleIntersect(callbacks), optionsFilled);
      this.observer.observe(this.targetElem);
    }
  }, {
    key: "handleIntersect",
    value: function handleIntersect(_ref) {
      var onIntersect = _ref.onIntersect,
          onEnter = _ref.onEnter,
          onLeave = _ref.onLeave;
      return function (entries, observer) {
        entries.forEach(function (entry) {
          !!onIntersect && onIntersect(entry, observer);
          entry.isIntersecting ? !!onEnter && onEnter(entry, observer) : !!onLeave && onLeave(entry, observer);
        });
      };
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props2 = this.props,
          _this$props2$targetCl = _this$props2.targetClass,
          targetClass = _this$props2$targetCl === void 0 ? 'intersection-target' : _this$props2$targetCl,
          _this$props2$targetSt = _this$props2.targetStyle,
          targetStyle = _this$props2$targetSt === void 0 ? {} : _this$props2$targetSt,
          _this$props2$children = _this$props2.children,
          children = _this$props2$children === void 0 ? null : _this$props2$children;
      return React.createElement("div", {
        ref: this.setTargetElem(),
        id: "intersection-target",
        style: targetStyle,
        className: targetClass
      }, children);
    }
  }]);

  return IntersectionTarget;
}(React.Component);

var _default = IntersectionTarget;
exports.default = _default;
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.checkOptionsChanged = checkOptionsChanged;
exports.checkOptionsValidity = checkOptionsValidity;
exports.validateOptions = validateOptions;
// tslint:disable-next-line
var warningMsg = 'Warning: Your invalid options have been replaced with default options. Please check to validate: https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API';

function checkOptionsChanged(prev, next) {
  return JSON.stringify(prev) !== JSON.stringify(next);
}

function checkOptionsValidity(options, defaultOptions) {
  var optionsKeys = Object.keys(options);
  var hasInvalidNumberOfOptions = optionsKeys.length > 3;
  var hasInvalidOptionKey = optionsKeys.filter(function (eachKey) {
    return defaultOptions[eachKey] === undefined;
  }).length > 0;
  return !hasInvalidNumberOfOptions && !hasInvalidOptionKey;
}

function validateOptions(options) {
  var defaultOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 1
  };
  var isOptionsValid = checkOptionsValidity(options, defaultOptions);

  if (!isOptionsValid) {
    console.error(warningMsg);
    return defaultOptions;
  }

  return Object.assign(defaultOptions, options);
}
