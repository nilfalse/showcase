'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _navigation = require('../components/navigation');

var _navigation2 = _interopRequireDefault(_navigation);

var _searchField = require('../components/search-field');

var _searchField2 = _interopRequireDefault(_searchField);

var _page = require('../core/page');

var _page2 = _interopRequireDefault(_page);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var html = function html() {
    var error = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : { message: '' };
    var ctx = arguments[1];
    return '\n' + ctx.navigation + '\n<article class="error-page">\n    <h1 class="error-page__title">Page not found</h1>\n    <p class="error-page__details">' + error.message + '</p>\n</article>\n';
};

var NotFoundPage = function (_Page) {
    _inherits(NotFoundPage, _Page);

    function NotFoundPage(router) {
        _classCallCheck(this, NotFoundPage);

        var _this = _possibleConstructorReturn(this, (NotFoundPage.__proto__ || Object.getPrototypeOf(NotFoundPage)).call(this, router));

        _this.log = _this.app.getLogger('nilfalse:not-found');
        _this.log('init');

        _this.searchField = new _searchField2.default(_this.app);
        _this.navigation = new _navigation2.default(_this.app);
        _this.paranja = _this.app.paranja;
        _this._setupSearchField();
        _this.navigation.setSearchField(_this.searchField);
        return _this;
    }

    _createClass(NotFoundPage, [{
        key: 'render',
        value: function render(error) {
            this.app.render(html(error, {
                navigation: this.navigation.render()
            }));
            this.paranja.remove();
            this.log('rendered');
        }
    }, {
        key: 'dispose',
        value: function dispose(route) {
            this.paranja.render();
            return _get(NotFoundPage.prototype.__proto__ || Object.getPrototypeOf(NotFoundPage.prototype), 'dispose', this).call(this, route);
        }
    }, {
        key: '_setupSearchField',
        value: function _setupSearchField() {
            var _this2 = this;

            this.searchField.on('reset', function () {
                _this2.log('search reset');
                _this2.app.router.setUrl('/');
            });
            this.searchField.on('search', function (term) {
                _this2.log('search ' + term);
                _this2.app.router.setUrl('/search?q=' + encodeURIComponent(term), { replace: true });
            });
        }
    }]);

    return NotFoundPage;
}(_page2.default);

exports.default = NotFoundPage;