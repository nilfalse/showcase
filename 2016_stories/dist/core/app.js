'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _eventEmitter = require('../utils/event-emitter');

var _eventEmitter2 = _interopRequireDefault(_eventEmitter);

var _router = require('./router');

var _router2 = _interopRequireDefault(_router);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var loggers = {};

var Application = function () {
    function Application() {
        var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            _ref$logger = _ref.logger,
            logger = _ref$logger === undefined ? null : _ref$logger,
            routes = _ref.routes,
            _ref$serviceWorker = _ref.serviceWorker,
            serviceWorker = _ref$serviceWorker === undefined ? null : _ref$serviceWorker,
            name = _ref.name;

        _classCallCheck(this, Application);

        _eventEmitter2.default.mixInto(this);

        this._logger = logger;
        this.log = this.getLogger('nilfalse:app');
        this.log('init');
        this.root = null;
        this.name = name;
        this.router = new _router2.default(routes, this);
        if (serviceWorker) {
            this._registerServiceWorker(serviceWorker.url, {
                scope: serviceWorker.scope
            });
        }
    }

    _createClass(Application, [{
        key: 'getLogger',
        value: function getLogger(ns) {
            if (loggers.hasOwnProperty(ns)) {
                return loggers[ns];
            }
            return loggers[ns] = this._logger ? this._logger(ns) : console.log.bind(console, ns);
        }
    }, {
        key: 'inject',
        value: function inject() {
            var _this = this;

            for (var _len = arguments.length, services = Array(_len), _key = 0; _key < _len; _key++) {
                services[_key] = arguments[_key];
            }

            services.forEach(function (Service) {
                return new Service(_this);
            });
            return this;
        }
    }, {
        key: 'capture',
        value: function capture(rootNode) {
            this.root = rootNode;
            this.emit('capture');
            this.router.start();
            this.log('started');
            return this;
        }
    }, {
        key: 'render',
        value: function render(html) {
            if (!this.root) {
                throw new Error('Application\'s root DOM node must have\n                been captured via capture() call before render() is allowed');
            }
            this.root.innerHTML = html;
            this.emit('render', html);
        }
    }, {
        key: '_registerServiceWorker',
        value: function _registerServiceWorker(url, _ref2) {
            var _this2 = this;

            var scope = _ref2.scope;

            if (!('serviceWorker' in navigator)) {
                return;
            }
            navigator.serviceWorker.register(url, { scope: scope }).then(function (reg) {
                if (reg.installing) {
                    _this2.log('service worker is installing');
                } else if (reg.waiting) {
                    _this2.log('service worker is installed');
                } else if (reg.active) {
                    _this2.log('service worker is active');
                }
            }).catch(function (err) {
                // registration failed
                _this2.log('service worker registration failed with ', err);
            });
        }
    }, {
        key: 'title',
        set: function set(val) {
            var prefix = val ? val + ' - ' : '';
            document.title = prefix + this.name;
        }
    }]);

    return Application;
}();

exports.default = Application;