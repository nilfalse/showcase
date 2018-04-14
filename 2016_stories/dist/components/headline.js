'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var html = function html(_ref) {
    var url = _ref.url,
        item = _ref.item,
        turbolink = _ref.turbolink;
    return '\n<h1 class="headline">\n    ' + turbolink.render(url, '\n        <img class="headline__media" src="' + item.image.tbUrl + '" alt="' + item.titleNoFormatting + '" />\n        <span class="headline__text">' + item.title + '</span>', ['headline__turbolink']) + '\n</h1>\n';
};

var HeadlineComponent = function () {
    function HeadlineComponent(app) {
        _classCallCheck(this, HeadlineComponent);

        this._app = app;
    }

    _createClass(HeadlineComponent, [{
        key: 'render',
        value: function render(url, item) {
            return html({ url: url, item: item, turbolink: this._app.turbolink });
        }
    }]);

    return HeadlineComponent;
}();

exports.default = HeadlineComponent;