import assign from 'object-assign';


const stoplist = [
    'a', 'and', 'at',
    'by', 'but',
    'for',
    'he', 'his',
    'in', 'is',
    'the', 'to',
    'of', 'on'
];

const indexedFields = [
    { name: 'content', weight: 3 },
    { name: 'title', weight: 10 }
];

export default class IndexedStorage {
    constructor(storage) {
        this._storage = storage;
        this._state = null;
        this._indices = this._storage.getState()
            .then(results => this._state = results)
            .then(this._buildIndex.bind(this, indexedFields));
    }

    getFilteredState(text, dates = { start: new Date(0), end: new Date() }) {
        const words = this.tokenize(text).map(word => new RegExp('^' + word));
        return this._indices
        .then(indices => {
            return indices.filter(description =>
                words.some(word => word.test(description.word))
            );
        })
        .then(found => {
            return found.reduce((groupedBySources, descripton) => {
                descripton.sources.forEach(source => {
                    const i = groupedBySources.findIndex(s => source.storyId === s.storyId);
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
        })
        .then(matches => matches.sort((a, b) => b.weight - a.weight))
        .then(matches => matches.map(item => {
            const rv = {};
            assign(rv, this._state[item.storyId], {localUrl: '/stories/' + item.storyId});
            return rv;
        }));
    }

    tokenize(sentence) {
        const index = [];
        sentence
            .replace(/&\w{2,6};/g, '')
            .replace(/&#[0-9a-f]{2,4};/g, '')
            .replace(/<\w+[^>]*>([^~]*?)<\/\w+>/g, (match, token) => {
                index.push(token.toLowerCase());
                return token;
            })
            .replace(/\w+/g, function(str) {
                const word = str.toLowerCase();
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

    _buildIndex(indexedFields, stories) {
        return stories.reduce((indices, story, id) => {
            const storyIndicesByField = indexedFields.map(this._buildFieldIndex.bind(this, story, id));
            const storyIndicesMerged = this._mergeFieldIndices(storyIndicesByField);

            storyIndicesMerged.forEach(description => {
                const word = description.word;
                const i = indices.findIndex(item => word === item.word);
                if (i < 0) {
                    indices.push({
                        word,
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
            })

            return indices;
        }, []);
    }

    _buildFieldIndex(story, storyId, field) {
        return this.tokenize(story[field.name]).map(word => {
            return {
                word: word,
                weight: field.weight,
                story: storyId,
            };
        }, {});
    }

    _mergeFieldIndices(fieldIndices) {
        return fieldIndices.reduce((mergedIndices, fieldIndex) => {
            fieldIndex.forEach(description => {
                const word = description.word;
                const i = mergedIndices.findIndex(item => word === item.word);
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
}
