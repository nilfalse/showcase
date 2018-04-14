"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = debounce;
function debounce(fn, timeout) {
    var ctx = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

    var timeoutId = null;

    return function () {
        if (null !== timeoutId) {
            clearTimeout(timeoutId);
            timeoutId = null;
        }
        timeoutId = setTimeout(fn.bind.apply(fn, [ctx].concat(Array.prototype.slice.call(arguments))), timeout);
    };
}