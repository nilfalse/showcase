'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _objectAssign = require('object-assign');

var _objectAssign2 = _interopRequireDefault(_objectAssign);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var stoplist = ['a', 'and', 'at', 'by', 'but', 'for', 'he', 'his', 'in', 'is', 'the', 'to', 'of', 'on'];

var indexedFields = [{ name: 'content', weight: 3 }, { name: 'title', weight: 10 }];

var IndexedStorage = function () {
    function IndexedStorage(storage) {
        var _this = this;

        _classCallCheck(this, IndexedStorage);

        this._storage = storage;
        this._state = null;
        this._indices = this._storage.getState().then(function (results) {
            return _this._state = results;
        }).then(this._buildIndex.bind(this, indexedFields));
    }

    _createClass(IndexedStorage, [{
        key: 'getFilteredState',
        value: function getFilteredState(text) {
            var _this2 = this;

            var dates = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : { start: new Date(0), end: new Date() };

            var words = this.tokenize(text).map(function (word) {
                return new RegExp('^' + word);
            });
            return this._indices.then(function (indices) {
                return indices.filter(function (description) {
                    return words.some(function (word) {
                        return word.test(description.word);
                    });
                });
            }).then(function (found) {
                return found.reduce(function (groupedBySources, descripton) {
                    descripton.sources.forEach(function (source) {
                        var i = groupedBySources.findIndex(function (s) {
                            return source.storyId === s.storyId;
                        });
                        if (i < 0) {
                            groupedBySources.push({
                                storyId: source.storyId,
                                weight: source.weight
                            });
                        } else {
                            groupedBySources[i].weight += source.weight;
                        }
                    });
                    return groupedBySources;
                }, []);
            }).then(function (matches) {
                return matches.sort(function (a, b) {
                    return b.weight - a.weight;
                });
            }).then(function (matches) {
                return matches.map(function (item) {
                    var rv = {};
                    (0, _objectAssign2.default)(rv, _this2._state[item.storyId], { localUrl: '/stories/' + item.storyId });
                    return rv;
                });
            });
        }
    }, {
        key: 'tokenize',
        value: function tokenize(sentence) {
            var index = [];
            sentence.replace(/&\w{2,6};/g, '').replace(/&#[0-9a-f]{2,4};/g, '').replace(/<\w+[^>]*>([^~]*?)<\/\w+>/g, function (match, token) {
                index.push(token.toLowerCase());
                return token;
            }).replace(/\w+/g, function (str) {
                var word = str.toLowerCase();
                if (word.length < 2) {
                    return;
                }
                if (~stoplist.indexOf(word)) {
                    return;
                }
                index.push(word);
            });
            return index;
        }
    }, {
        key: '_buildIndex',
        value: function _buildIndex(indexedFields, stories) {
            var _this3 = this;

            return stories.reduce(function (indices, story, id) {
                var storyIndicesByField = indexedFields.map(_this3._buildFieldIndex.bind(_this3, story, id));
                var storyIndicesMerged = _this3._mergeFieldIndices(storyIndicesByField);

                storyIndicesMerged.forEach(function (description) {
                    var word = description.word;
                    var i = indices.findIndex(function (item) {
                        return word === item.word;
                    });
                    if (i < 0) {
                        indices.push({
                            word: word,
                            sources: [{
                                storyId: id,
                                weight: description.weight
                            }]
                        });
                    } else {
                        indices[i].sources.push({
                            storyId: id,
                            weight: description.weight
                        });
                    }
                });

                return indices;
            }, []);
        }
    }, {
        key: '_buildFieldIndex',
        value: function _buildFieldIndex(story, storyId, field) {
            return this.tokenize(story[field.name]).map(function (word) {
                return {
                    word: word,
                    weight: field.weight,
                    story: storyId
                };
            }, {});
        }
    }, {
        key: '_mergeFieldIndices',
        value: function _mergeFieldIndices(fieldIndices) {
            return fieldIndices.reduce(function (mergedIndices, fieldIndex) {
                fieldIndex.forEach(function (description) {
                    var word = description.word;
                    var i = mergedIndices.findIndex(function (item) {
                        return word === item.word;
                    });
                    if (i < 0) {
                        mergedIndices.push(description);
                    } else {
                        mergedIndices[i].weight += description.weight;
                    }
                    return description;
                });
                return mergedIndices;
            }, []);
        }
    }]);

    return IndexedStorage;
}();

exports.default = IndexedStorage;