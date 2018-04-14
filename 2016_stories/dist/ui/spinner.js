'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var selector = '.spinner__image';

var Spinner = function () {
    function Spinner(app) {
        var _this = this;

        _classCallCheck(this, Spinner);

        app.spinner = this;
        app.on('capture', function () {
            _this.render();
        });
    }

    _createClass(Spinner, [{
        key: 'render',
        value: function render() {
            Array.from(document.querySelectorAll(selector)).forEach(function (parent) {
                var i = new Image();
                if (parent.querySelector('img')) {
                    return;
                }
                i.src = '/preloader.gif';
                parent.appendChild(i);
            });
        }
    }, {
        key: 'remove',
        value: function remove() {
            Array.from(document.querySelectorAll(selector)).forEach(function (parent) {
                while (parent.lastChild) {
                    parent.removeChild(parent.lastChild);
                }
            });
        }
    }]);

    return Spinner;
}();

exports.default = Spinner;