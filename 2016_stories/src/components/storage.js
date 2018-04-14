const url = './data.json';

function strToDateObj(str) {
    return new Date(Date.parse(str));
}

function parseObjectFromJSON(jsonObj) {
    jsonObj.publishedDate = strToDateObj(jsonObj.publishedDate);
    return jsonObj;
}

export default class Storage {
    constructor(app) {
        this.log = app.getLogger('nilfalse:storage');
        this._promise = null;
        app.storage = this;
    }

    getState() {
        return this._fetchOnce()
            .then(response => response.results)
            .then(results =>
                results.map(item => {
                    item = parseObjectFromJSON(item);
                    if (item.hasOwnProperty('relatedStories')) {
                        item.relatedStories = item.relatedStories.map(parseObjectFromJSON);
                    }
                    return item;
                }));
    }
    getStory(id) {
        return this.getState()
            .then(results => {
                if (!results.hasOwnProperty(id)) {
                    return Promise.reject({code: 404, message: 'story not found'});
                }
                return results[id];
            });
    }

    _fetchOnce() {
        if (!this._promise) {
            this.log('fetch');
            this._promise = fetch(url).then(response => response.json());
        }
        return this._promise;
    }
}
