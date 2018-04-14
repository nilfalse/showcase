let log;

function render({place, conditions, forecast}) {
    log('render', place, conditions, forecast);

    document.querySelector('.popup__title').innerText =
        chrome.i18n.getMessage('popup_title', [place.city, place.country]);
    document.querySelector('.popup__image').src = conditions.icon.url;

    document.querySelector('.popup__today').innerText = chrome.i18n.getMessage('popup_today');

    document.querySelector('.popup__temp').innerHTML = chrome.i18n.getMessage('popup_conds', [
        conditions.temp.c,
        conditions.feelslike.c ? chrome.i18n.getMessage('popup_conds_additional', conditions.feelslike.c) : ''
    ]);

    document.querySelector('.popup__wind').innerHTML = renderWind(conditions.wind);

    document.querySelector('.forecast').innerHTML = '';
    forecast.forEach(renderForecast);
}

function renderWind(wind) {
    return chrome.i18n.getMessage('popup_wind', [wind.dir, wind.degrees, wind.kph]);
}

function renderForecast(forecast) {
    const node = document.createElement('li');

    const t = [
        { c: forecast.low.celsius, f: forecast.low.fahrenheit },
        { c: forecast.high.celsius, f: forecast.high.fahrenheit }
    ];
    node.innerHTML = chrome.i18n.getMessage('popup_forecast',
        [forecast.date.monthname, forecast.date.day, t[0].c, t[1].c, renderWind(forecast.avewind)]);

    const img = new Image();
    img.src = forecast.icon_url;
    node.insertBefore(img, node.firstChild.nextSibling);
    node.className = 'forecast__day';
    document.querySelector('.forecast').appendChild(node);
}

chrome.runtime.getBackgroundPage(function (background) {
    log = background.getLogger('popup');
    chrome.runtime.sendMessage({ type: 'pull' }, render);
});

addEventListener('click', function (evt) {
    const button = evt.target;

    if (button.tagName !== 'BUTTON') {
        return;
    }

    switch (button.dataset.action) {
    case 'openOptionsPage':
        chrome.runtime.openOptionsPage();
        break;
    default:
        throw {
            code: 'E_UNKNOWN_BUTTON',
            message: 'unexpected action for button: ' + button.dataset.action
        };
        break;
    }
});
