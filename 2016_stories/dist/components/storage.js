'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var url = './data.json';

function strToDateObj(str) {
    return new Date(Date.parse(str));
}

function parseObjectFromJSON(jsonObj) {
    jsonObj.publishedDate = strToDateObj(jsonObj.publishedDate);
    return jsonObj;
}

var Storage = function () {
    function Storage(app) {
        _classCallCheck(this, Storage);

        this.log = app.getLogger('nilfalse:storage');
        this._promise = null;
        app.storage = this;
    }

    _createClass(Storage, [{
        key: 'getState',
        value: function getState() {
            return this._fetchOnce().then(function (response) {
                return response.results;
            }).then(function (results) {
                return results.map(function (item) {
                    item = parseObjectFromJSON(item);
                    if (item.hasOwnProperty('relatedStories')) {
                        item.relatedStories = item.relatedStories.map(parseObjectFromJSON);
                    }
                    return item;
                });
            });
        }
    }, {
        key: 'getStory',
        value: function getStory(id) {
            return this.getState().then(function (results) {
                if (!results.hasOwnProperty(id)) {
                    return Promise.reject({ code: 404, message: 'story not found' });
                }
                return results[id];
            });
        }
    }, {
        key: '_fetchOnce',
        value: function _fetchOnce() {
            if (!this._promise) {
                this.log('fetch');
                this._promise = fetch(url).then(function (response) {
                    return response.json();
                });
            }
            return this._promise;
        }
    }]);

    return Storage;
}();

exports.default = Storage;