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

var html = function html(story, dateFormatter, nav) {
    return '\n' + nav + '\n<article class="story">\n    <h1 class="story__headline">' + story.title + '</h1>\n    <time class="story__time" datetime="' + story.publishedDate.toISOString() + '" title="time is in your local timezone">\n        ' + dateFormatter.format(story.publishedDate) + '\n    </time>\n    <p class="story__content">' + story.content + '</p>\n    <p class="story__read-more">\n        <a href="' + story.unescapedUrl + '" target="_blank">read more\n            <span class="story__read-more-arrow"></span>\n        </a>\n    </p>\n    ' + relatedStories(story.relatedStories) + '\n    <figure class="story__media">\n        <img class="story__media-image" src="' + story.image.url + '" alt="' + story.titleNoFormatting + '" />\n        <figcaption class="story__media-title">' + story.title + '</figcaption>\n    </figure>\n</article>\n';
};

var relatedStory = function relatedStory(story) {
    return '\n<li class="related story__related-item">\n    <span class="related__publisher">' + story.publisher + ':</span>\n    <a href="' + story.unescapedUrl + '" class="related__link" target="_blank">\n        ' + story.title + '\n    </a>\n</li>\n';
};

function relatedStories() {
    var stories = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

    return stories.length ? '\n        <p class="story__related">See also</p>\n        <ul class="story__related-list">\n        ' + stories.map(relatedStory).join('') + '\n        </ul>\n        ' : '<p class="story__no-related-stories">No related stories</p>';
};

var dateSpec = '%b %d, %Y %H:%M';

var StoryPage = function (_Page) {
    _inherits(StoryPage, _Page);

    function StoryPage(router) {
        _classCallCheck(this, StoryPage);

        var _this = _possibleConstructorReturn(this, (StoryPage.__proto__ || Object.getPrototypeOf(StoryPage)).call(this, router));

        _this.log = _this.app.getLogger('nilfalse:story');
        _this.log('init');

        _this.storage = _this.app.storage;
        _this.paranja = _this.app.paranja;
        _this.searchField = new _searchField2.default(_this.app);
        _this.navigation = new _navigation2.default(_this.app);
        _this.DateFormatter = router.getPayload('DateFormatter');

        _this._setupSearchField();
        _this.navigation.setSearchField(_this.searchField);

        var params = router.getParams();
        _this.storage.getStory(params.id).then(function (story) {
            return _this.render(story);
        }, function (error) {
            if (404 === error.code) {
                return router.emitNotFound(error);
            }
            return Promise.reject(error);
        });
        return _this;
    }

    _createClass(StoryPage, [{
        key: 'render',
        value: function render(story) {
            this.log(story);
            this.app.title = story.titleNoFormatting;
            this.app.render(html(story, new this.DateFormatter(dateSpec), this.navigation.render()));
            this.paranja.remove();
            this.log('rendered');
        }
    }, {
        key: 'dispose',
        value: function dispose() {
            this.paranja.render();
            return _get(StoryPage.prototype.__proto__ || Object.getPrototypeOf(StoryPage.prototype), 'dispose', this).call(this);
        }
    }, {
        key: '_setupSearchField',
        value: function _setupSearchField() {
            var _this2 = this;

            this.searchField.on('reset', function () {
                _this2.log('search reset');
                _this2.app.router.setUrl('../');
            });
            this.searchField.on('search', function (term) {
                _this2.log('search ' + term);
                _this2.app.router.setUrl('../search?q=' + encodeURIComponent(term));
            });
        }
    }]);

    return StoryPage;
}(_page2.default);

exports.default = StoryPage;