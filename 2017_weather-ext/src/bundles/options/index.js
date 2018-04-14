function localize() {
    document.querySelector('.options__title').innerText = chrome.i18n.getMessage('options_title');
}

localize();
