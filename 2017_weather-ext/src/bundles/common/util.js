function setRemoteIcon (url, text = null) {
    const canvas = document.createElement('canvas');
    const img = new Image();
    img.onload = function () {
        const context = canvas.getContext('2d');
        context.drawImage(img, 0, 0);

        if (text) {
            context.fillStyle = 'blue';
            context.font = 'bold 36px Arial';
            context.textAlign = 'end';
            context.textBaseline = 'ideographic';
            context.fillText(text, img.width, img.height);
        }

        chrome.browserAction.setIcon({
            imageData: context.getImageData(0, 0, img.width, img.height)
        });
    };
    img.src = url;
}

function getLogger (componentName) {
    if (!getLogger._loggers) {
        getLogger._loggers = {};
    }
    if (!getLogger._loggers[componentName]) {
        getLogger._loggers[componentName] = debug(componentName);
    }
    return getLogger._loggers[componentName];
}

function cached (func, {minutes, name}) {
    const cacheKey = name || func.name;
    const subscribers = [];

    function getCache () {
        const cache = localStorage.getItem(cacheKey);
        return cache ? JSON.parse(cache) : {
            updated_at: null,
            result: null
        };
    }

    function setCache (value) {
        localStorage.setItem(cacheKey, JSON.stringify({
            updated_at: Date.now(),
            result: value
        }));
    }

    function notifySubscribers (result) {
        subscribers.forEach(func => func(result));
    }

    function decoratorCachedFunction () {
        const cache = getCache();
        const timeout = Date.now() - minutes * 60 * 1000;

        if (cache.updated_at < timeout) {
            cache.result = func.apply(this, arguments);
            cache.result.then(setCache);
            cache.result.then(notifySubscribers);
            return cache.result;
        } else {
            return Promise.resolve(cache.result);
        }
    }
    decoratorCachedFunction.onUpdate = function cacheOnUpdate (func) {
        subscribers.push(func);
    }

    return decoratorCachedFunction;
}
