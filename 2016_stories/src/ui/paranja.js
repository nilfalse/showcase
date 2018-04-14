const selector = '.paranja';

export default class Paranja {
    constructor(app) {
        app.paranja = this;
        app.on('capture', () => {
            this.render();
        })
    }

    render() {
        Array
            .from(document.querySelectorAll(selector))
            .forEach(paranja => {
                paranja.style.display = '';
            });
    }

    remove() {
        Array
            .from(document.querySelectorAll(selector))
            .forEach(paranja => {
                paranja.style.display = 'none';
            });
    }
}
