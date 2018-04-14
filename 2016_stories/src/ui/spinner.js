const selector = '.spinner__image';

export default class Spinner {
    constructor(app) {
        app.spinner = this;
        app.on('capture', () => {
            this.render();
        });
    }

    render() {
        Array
            .from(document.querySelectorAll(selector))
            .forEach(parent => {
                const i = new Image();
                if (parent.querySelector('img')) {
                    return;
                }
                i.src = '/preloader.gif';
                parent.appendChild(i);
            });
    }

    remove() {
        Array
            .from(document.querySelectorAll(selector))
            .forEach(parent => {
                while (parent.lastChild) {
                    parent.removeChild(parent.lastChild);
                }
            });
    }
}
