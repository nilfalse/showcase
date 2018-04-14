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

var HomePage = function (_Page) {
    _inherits(HomePage, _Page);

    function HomePage(router) {
        _classCallCheck(this, HomePage);

        var _this = _possibleConstructorReturn(this, (HomePage.__proto__ || Object.getPrototypeOf(HomePage)).call(this, router));

        _this.log = _this.app.getLogger('nilfalse:homepage');
        _this.log('init');
        _this.paranja = _this.app.paranja;
        _this.storage = _this.app.storage;

        _this.navigation = new _navigation2.default(_this.app);
        _this.searchField = new _searchField2.default(_this.app);
        _this.headline = new _headline2.default(_this.app);
        _this.navigation.setSearchField(_this.searchField);
        _this.storage.getState().then(function (results) {
            return _this.render(results);
        });

        _this.searchField.on('search', function (val) {
            _this.log('search ', val);
            router.setUrl('./search?q=' + encodeURIComponent(val));
        });
        return _this;
    }

    _createClass(HomePage, [{
        key: 'render',
        value: function render(items) {
            var _this2 = this;

            var headlines = items.map(function (item, idx) {
                return _this2.headline.render('./stories/' + idx, item);
            }).join('');
            this.app.title = '';

            this.app.render(html({
                navigation: this.navigation.render(),
                headlines: headlines
            }));
            this.paranja.remove();
            this.log('rendered');
        }
    }, {
        key: 'dispose',
        value: function dispose() {
            this.paranja.render();
            return _get(HomePage.prototype.__proto__ || Object.getPrototypeOf(HomePage.prototype), 'dispose', this).call(this);
        }
    }]);

    return HomePage;
}(_page2.default);

exports.default = HomePage;