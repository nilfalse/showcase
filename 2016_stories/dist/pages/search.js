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

var _headline = require('../components/headline');

var _headline2 = _interopRequireDefault(_headline);

var _page = require('../core/page');

var _page2 = _interopRequireDefault(_page);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var html = function html(ctx) {
    return '\n' + ctx.navigation + '\n<section class="headlines">\n    ' + ctx.headlines + '\n</section>\n';
};

var noHeadlinesFound = function noHeadlinesFound() {
    return '\n<p class="headlines__no-headlines-found">No stories found</p>\n';
};

var SearchPage = function (_Page) {
    _inherits(SearchPage, _Page);

    function SearchPage(router) {
        _classCallCheck(this, SearchPage);

        var _this = _possibleConstructorReturn(this, (SearchPage.__proto__ || Object.getPrototypeOf(SearchPage)).call(this, router));

        _this.log = _this.app.getLogger('nilfalse:search');
        _this.log('init');

        _this._router = router;
        _this.paranja = _this.app.paranja;

        var IndexedStorage = router.getPayload('source');
        _this.storage = new IndexedStorage(_this.app.storage);

        _this.navigation = new _navigation2.default(_this.app);
        _this.searchField = new _searchField2.default(_this.app);
        _this.headline = new _headline2.default(_this.app);

        _this._setupSearchField();
        _this.searchField.setFocus();
        _this.navigation.setSearchField(_this.searchField);
        _this.render();
        _this.renderHeadlines();
        return _this;
    }

    _createClass(SearchPage, [{
        key: 'render',
        value: function render() {
            this.app.title = this._router.getParams().q + ' / search';
            this.app.render(html({
                navigation: this.navigation.render(),
                headlines: ''
            }));
            this.paranja.remove();
            this.log('rendered');
        }
    }, {
        key: 'renderHeadlines',
        value: function renderHeadlines() {
            var _this2 = this;

            var node = this.app.root.querySelector('.headlines');
            if (!node) {
                return;
            }
            var term = this._router.getParams().q;
            return this.storage.getFilteredState(term).then(function (items) {
                return items.map(function (item, idx) {
                    return _this2.headline.render(item.localUrl, item);
                });
            }).then(function (items) {
                return node.innerHTML = items.length > 0 ? items.join('') : noHeadlinesFound();
            });
        }
    }, {
        key: 'handleRouteChange',
        value: function handleRouteChange() {
            this.log('handle route change');
            this.searchField.setValue(this._router.getParams().q);
            this.renderHeadlines();
            this.app.title = 'search / ' + this._router.getParams().q;
        }
    }, {
        key: 'dispose',
        value: function dispose() {
            this.paranja.render();
            return _get(SearchPage.prototype.__proto__ || Object.getPrototypeOf(SearchPage.prototype), 'dispose', this).call(this);
        }
    }, {
        key: '_setupSearchField',
        value: function _setupSearchField() {
            var _this3 = this;

            this.searchField.on('reset', function () {
                _this3.log('search reset');
                _this3._router.setUrl('./');
            });
            this.searchField.on('search', function (term) {
                _this3.log('search ' + term);
                _this3._router.setUrl('./search?q=' + encodeURIComponent(term), { replace: true });
            });
        }
    }]);

    return SearchPage;
}(_page2.default);

exports.default = SearchPage;