'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _objectAssign = require('object-assign');

var _objectAssign2 = _interopRequireDefault(_objectAssign);

var _eventEmitter = require('../utils/event-emitter');

var _eventEmitter2 = _interopRequireDefault(_eventEmitter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Router = function () {
    function Router(routes, app) {
        _classCallCheck(this, Router);

        _eventEmitter2.default.mixInto(this);

        this.log = app.getLogger('nilfalse:router');
        this.notFoundRoute = null;
        this._currRoute = null;
        this._currHandler = null;
        this._app = app;
        this._routes = this._compileRoutes(routes);
    }

    _createClass(Router, [{
        key: 'start',
        value: function start() {
            var _this = this;

            window.addEventListener('popstate', function (e) {
                _this.log('popstate', e.state);
                _this._execute(document.location);
            });
            this._execute(document.location);
        }
    }, {
        key: 'getApp',
        value: function getApp() {
            return this._app;
        }
    }, {
        key: 'getParams',
        value: function getParams() {
            return this._currRoute ? this._currRoute.params : {};
        }
    }, {
        key: 'getPayload',
        value: function getPayload(name) {
            var payload = this._currRoute ? this._currRoute.payload : {};
            return name ? payload && payload[name] || null : payload;
        }
    }, {
        key: 'emitNotFound',
        value: function emitNotFound(error) {
            this._currRoute = this.notFoundRoute;
            this.log('handling error 404');
            this.emit('route:@404', this.notFoundRoute && this.notFoundRoute.payload);
            this.emit('route', this.notFoundRoute);
            if (this.notFoundRoute) {
                this.emit('dispose');
                var page = new this.notFoundRoute.handler(this);
                page.render(error);
                this._currHandler = page;
            }
        }
    }, {
        key: 'setUrl',
        value: function setUrl(url) {
            var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
                _ref$replace = _ref.replace,
                replace = _ref$replace === undefined ? false : _ref$replace;

            var payload = {};
            var title = {};
            var method = replace ? 'replaceState' : 'pushState';
            if (url === document.location.href) {
                return;
            }
            window.history[method](payload, title, url);
            this._execute(document.location);
        }
    }, {
        key: '_compileRoutes',
        value: function _compileRoutes(routes) {
            var _this2 = this;

            var pathMatchRexp = /:(\w+)/ig;
            if (routes.hasOwnProperty('@404')) {
                this.notFoundRoute = {
                    handler: routes['@404'].handler,
                    payload: routes['@404'].payload
                };
            }
            return Object.keys(routes).filter(function (r) {
                return r.startsWith('/');
            }).map(function (route) {
                var params = [];
                var rexp = route.replace(pathMatchRexp, function (token, paramName, offset) {
                    params.push(paramName);
                    return '(\\w+)';
                });

                _this2.log('registered', route, params.join(', '));
                return {
                    pattern: route,
                    rexp: new RegExp( /*'^' + */rexp + '$', 'i'),
                    paramsList: params,
                    handler: routes[route].handler,
                    payload: routes[route]
                };
            });
        }
    }, {
        key: '_execute',
        value: function _execute(location) {
            var route = this._findMatch(location);
            var queryParams = this._parseUrlParams(location.search.substr(1));
            if (route) {
                this._currRoute = route;
                this.log('matched', route.pattern, route.params);
                this.log('query', queryParams);
                route.params = (0, _objectAssign2.default)({}, queryParams, route.params);
                this.emit('route:' + route.pattern, route.params);
                this.emit('route', route);
                if (route.handler) {
                    if (this._currHandler instanceof route.handler && 'handleRouteChange' in this._currHandler) {
                        this._currHandler.handleRouteChange();
                    } else {
                        this.emit('dispose');
                        this._currHandler = new route.handler(this);
                    }
                } else {
                    this.log('no handler set for matched route');
                }
            } else {
                this.emitNotFound();
            }
        }
    }, {
        key: '_findMatch',
        value: function _findMatch(loc) {
            var params = null;
            var route = this._routes.find(function (route) {
                params = route.rexp.exec(loc.pathname);
                return null !== params;
            });

            return route ? {
                pattern: route.pattern,
                handler: route.payload.handler,
                params: route.paramsList.reduce(function (state, token, idx) {
                    state[token] = params[idx + 1];
                    return state;
                }, {}),
                payload: route.payload
            } : null;
        }
    }, {
        key: '_parseUrlParams',
        value: function _parseUrlParams(queryStr) {
            return queryStr.split("&").reduce(function (state, str) {
                var _str$split$map$reduce = str.split("=").map(decodeURIComponent).reduce(function (state, str) {
                    var l = state.length;
                    if (l < 2) {
                        state.push(str);
                    } else {
                        state[l - 1] = state[l - 1] + '=' + str;
                    }
                    return state;
                }, []),
                    _str$split$map$reduce2 = _slicedToArray(_str$split$map$reduce, 2),
                    k = _str$split$map$reduce2[0],
                    v = _str$split$map$reduce2[1];

                if (k) {
                    state[k] = v;
                }
                return state;
            }, {});
        }
    }]);

    return Router;
}();

exports.default = Router;