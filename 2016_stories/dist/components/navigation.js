'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var html = function html(ctx) {
    return '\n<nav class="navigation">\n    ' + ctx.turbolink.render('./', 'Home', ['navigation__home']) + '\n    ' + ctx.search.render(ctx.searchTerm) + '\n</nav>\n';
};

var NavigationComponent = function () {
    function NavigationComponent(app) {
        _classCallCheck(this, NavigationComponent);

        this._app = app;
    }

    _createClass(NavigationComponent, [{
        key: 'setSearchField',
        value: function setSearchField(searchField) {
            this._search = searchField;
        }
    }, {
        key: 'render',
        value: function render() {
            var params = this._app.router.getParams();
            return html({
                turbolink: this._app.turbolink,
                search: this._search,
                searchTerm: params ? params.q : ''
            });
        }
    }]);

    return NavigationComponent;
}();

exports.default = NavigationComponent;