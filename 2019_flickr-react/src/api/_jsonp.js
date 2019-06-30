let uniqCounter = 0;

export const embedScript = (url) => {
  const scripts = document.getElementsByTagName('script');
  const script = document.createElement('script');
  script.src = url;

  function cleanup () {
    script.parentNode.removeChild(script);
  }

  return new Promise(function (resolve, reject) {
    const target = scripts[scripts.length - 1];

    script.onload = function () {
      cleanup();
      resolve();
    };
    script.onerror = function (err) {
      cleanup();
      reject(err);
    };

    target.parentNode.insertBefore(script, target);
  });
};

const extendBaseParams = (params) => {
  return {
    ...params,
    jsoncallback: 'jsonFlickrFeed' + (++uniqCounter),
  };
};

export const request = (url, params = {}) => {
  const urlSearchParams = extendBaseParams(params);

  const urlObj = new URL(url);
  Object
    .entries(urlSearchParams)
    .forEach(([name, value]) => { urlObj.searchParams.set(name, value); });

  return new Promise(async (resolve, reject) => {
    window[urlSearchParams.jsoncallback] = (response) => {
      delete window[urlSearchParams.jsoncallback];
      resolve(response);
    };

    try {
      await embedScript(urlObj.href);
    } catch (e) {
      delete window[urlSearchParams.jsoncallback];
      reject(e);
    }
  });
};
