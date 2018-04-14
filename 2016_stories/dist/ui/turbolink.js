'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var html = function html(url, content, classes) {
    return '\n<a class="turbolink ' + classes.join(' ') + '" href="' + url + '">' + content + '</a>\n';
};

var selector = 'a.turbolink';

var Turbolink = function () {
    function Turbolink(app) {
        var _this = this;

        _classCallCheck(this, Turbolink);

        this.log = app.getLogger('nilfalse:turbolink');
        this.router = app.router;
        this._handleClick = this._handleClick.bind(this);
        app.turbolink = this;
        app.on('capture', function () {
            app.root.addEventListener('click', _this._handleClick);
        });
    }

    _createClass(Turbolink, [{
        key: 'render',
        value: function render(url, content) {
            var classes = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];

            return html(url, content, classes);
        }
    }, {
        key: '_handleClick',
        value: function _handleClick(evt) {
            var a = evt.target;

            while (a && !a.matches(selector)) {
                a = a.parentNode;
                if (a === document.body) {
                    return;
                }
            }
            this.log('click ', a.href);
            evt.preventDefault();
            this.router.setUrl(a.href);
        }
    }]);

    return Turbolink;
}();

exports.default = Turbolink;