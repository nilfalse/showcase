'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var selector = '.paranja';

var Paranja = function () {
    function Paranja(app) {
        var _this = this;

        _classCallCheck(this, Paranja);

        app.paranja = this;
        app.on('capture', function () {
            _this.render();
        });
    }

    _createClass(Paranja, [{
        key: 'render',
        value: function render() {
            Array.from(document.querySelectorAll(selector)).forEach(function (paranja) {
                paranja.style.display = '';
            });
        }
    }, {
        key: 'remove',
        value: function remove() {
            Array.from(document.querySelectorAll(selector)).forEach(function (paranja) {
                paranja.style.display = 'none';
            });
        }
    }]);

    return Paranja;
}();

exports.default = Paranja;