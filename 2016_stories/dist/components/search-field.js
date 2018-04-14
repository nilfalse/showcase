'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _debounce = require('../utils/debounce');

var _debounce2 = _interopRequireDefault(_debounce);

var _eventEmitter = require('../utils/event-emitter');

var _eventEmitter2 = _interopRequireDefault(_eventEmitter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var html = function html(prefilledValue) {
    return '\n<div class="headlines-filter">\n    <input type="search"\n        class="headlines-filter__control"\n        placeholder="Search through stories"\n        value="' + prefilledValue + '" />\n</div>\n';
};

var selector = 'input.headlines-filter__control';

var SearchFieldComponent = function () {
    function SearchFieldComponent(app) {
        _classCallCheck(this, SearchFieldComponent);

        _eventEmitter2.default.mixInto(this);
        this._app = app;
        this._node = null;
        this._value = '';
        this._onInput = (0, _debounce2.default)(this._onInput, 300, this);
        app.once('render', this._postInit.bind(this));
    }

    _createClass(SearchFieldComponent, [{
        key: 'render',
        value: function render() {
            var prefilledValue = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

            this._value = prefilledValue;
            return html(prefilledValue);
        }
    }, {
        key: 'setValue',
        value: function setValue(newVal) {
            if (newVal.trim() !== this._node.value.trim()) {
                this._node.value = newVal;
                this._node.setSelectionRange(this._node.value.length, this._node.value.length);
            }
            this._value = newVal;
        }
    }, {
        key: 'setFocus',
        value: function setFocus() {
            if (!this._node) {
                return;
            }
            node.focus();
        }
    }, {
        key: '_postInit',
        value: function _postInit() {
            var node = this._app.root.querySelector(selector);
            if (!node) {
                return;
            }
            this._node = node;
            node.addEventListener('input', this._onInput, false);
            node.setSelectionRange(node.value.length, node.value.length);
        }
    }, {
        key: '_fire',
        value: function _fire(val) {
            if (val.length) {
                this.emit('search', val);
            } else {
                this.emit('reset');
            }
        }
    }, {
        key: '_onInput',
        value: function _onInput(evt) {
            this._value = evt.target.value;
            this._fire(evt.target.value);
        }
    }]);

    return SearchFieldComponent;
}();

exports.default = SearchFieldComponent;