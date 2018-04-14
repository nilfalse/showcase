const log = getLogger('background');

function renderAction ({place, conditions, forecast}) {
    log('updating browser action icon');
    setRemoteIcon(conditions.icon.url, Math.round(conditions.temp.c));
}

storage.pull.onUpdate(renderAction);

chrome.runtime.onMessage.addListener(function (req, sender, sendResponse) {
    log('message:' + req.type);
    switch (req.type) {
    case 'pull':
        storage.pull().then(sendResponse);
        return true;
    default:
        throw {
            code: 'E_UNKNOWN_MESSAGE',
            message: 'unexpected message: ' + req.type,
            details: req
        };
        break;
    }
});

chrome.alarms.onAlarm.addListener(function (alarm) {
    log('alarm:' + alarm.name);
    switch (alarm.name) {
    case 'refresh':
        storage.pull().then(renderAction);
        break;
    default:
        throw {
            code: 'E_UNKNOWN_ALARM',
            message: 'unexpected alarm: ' + alarm.name,
            details: alarm
        };
        break;
    }
});

chrome.runtime.onInstalled.addListener(function (reason, prevVersion, id) {
    log('runtime installed');
    chrome.alarms.create('refresh', {
        when: Date.now(),
        periodInMinutes: 60
    });
});
