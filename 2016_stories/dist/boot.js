'use strict';

require('corejs');

require('fetch');

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

var _app = require('./core/app');

var _app2 = _interopRequireDefault(_app);

var _dateFormatter = require('./utils/date-formatter');

var _dateFormatter2 = _interopRequireDefault(_dateFormatter);

var _paranja = require('./ui/paranja');

var _paranja2 = _interopRequireDefault(_paranja);

var _spinner = require('./ui/spinner');

var _spinner2 = _interopRequireDefault(_spinner);

var _turbolink = require('./ui/turbolink');

var _turbolink2 = _interopRequireDefault(_turbolink);

var _home = require('./pages/home');

var _home2 = _interopRequireDefault(_home);

var _search = require('./pages/search');

var _search2 = _interopRequireDefault(_search);

var _story = require('./pages/story');

var _story2 = _interopRequireDefault(_story);

var _notFound = require('./pages/not-found');

var _notFound2 = _interopRequireDefault(_notFound);

var _storage = require('./components/storage');

var _storage2 = _interopRequireDefault(_storage);

var _indexedStorage = require('./components/indexed-storage');

var _indexedStorage2 = _interopRequireDefault(_indexedStorage);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// finally import pages and their deps


// 3rd party libraries go next.
// But as long as there is a requirement
// not to use other libraries, including helper libraries such as templating ones
// there is only one import in this section which is anyway absolutely optional
// and may be removed without any impact on user experience (and with no code changes)
// following imports are polyfils
var app = new _app2.default({
    name: 'News Store',
    logger: _debug2.default,
    /* serviceWorker: {
        url: '/sw.js',
        scope: '/'
    }, */
    routes: {
        '@404': {
            handler: _notFound2.default
        },

        '/search': {
            handler: _search2.default,
            source: _indexedStorage2.default
        },
        '/stories/:id': {
            handler: _story2.default,
            DateFormatter: _dateFormatter2.default
        },
        '/stories/': { // redirect to /
            handler: function handler(router) {
                return router.setUrl('..', { replace: true });
            }
        },
        '/': {
            handler: _home2.default
        }
    }
});

// import core application functionality


app.inject(_paranja2.default, _spinner2.default, _storage2.default, _turbolink2.default);
app.capture(document.getElementById('app'));