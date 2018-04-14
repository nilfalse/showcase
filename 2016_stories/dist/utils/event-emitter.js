'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _objectAssign = require('object-assign');

var _objectAssign2 = _interopRequireDefault(_objectAssign);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var eventEmitter = {
    mixInto: function mixInto(dest) {
        (0, _objectAssign2.default)(dest, {
            _listeners: {},
            emit: this.emit,
            on: this.on,
            once: this.once,
            off: this.off,
            has: this.has
        });
    },

    emit: function emit(evt) {
        for (var _len = arguments.length, payload = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
            payload[_key - 1] = arguments[_key];
        }

        if (!this._listeners.hasOwnProperty(evt)) {
            return false;
        }
        this._listeners[evt].forEach(function (cb) {
            try {
                cb.apply(undefined, payload);
            } catch (o_O) {}
        });
    },

    on: function on(evt, cb) {
        if (this.has(evt, cb)) {
            return false;
        }

        if (!this._listeners.hasOwnProperty(evt)) {
            this._listeners[evt] = [];
        }
        this._listeners[evt].push(cb);
        return true;
    },
    once: function once(evt, cb) {
        var callbackOnce = function () {
            this.off(evt, callbackOnce);
            cb.apply(undefined, arguments);
        }.bind(this);
        this.on(evt, callbackOnce);
    },
    off: function off(evt) {
        var cb = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

        if (!this._listeners.hasOwnProperty(evt)) {
            return false;
        }
        if (!cb) {
            delete this._listeners[evt];
            return;
        }
        var idx = this._listeners[evt].indexOf(cb);
        if (-1 === idx) {
            return false;
        }
        this._listeners[evt].splice(idx, 1);
        return true;
    },

    has: function has(evt, cb) {
        if (!this._listeners.hasOwnProperty(evt)) {
            return false;
        }
        if (~this._listeners[evt].indexOf(cb)) {
            return true;
        }
        return false;
    }
};

exports.default = eventEmitter;