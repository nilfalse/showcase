const html = (url, content, classes) => `
<a class="turbolink ${classes.join(' ')}" href="${url}">${content}</a>
`;

const selector = 'a.turbolink';

export default class Turbolink {
    constructor(app) {
        this.log = app.getLogger('nilfalse:turbolink');
        this.router = app.router;
        this._handleClick = this._handleClick.bind(this);
        app.turbolink = this;
        app.on('capture', () => {
            app.root.addEventListener('click', this._handleClick);
        })
    }

    render(url, content, classes = []) {
        return html(url, content, classes);
    }

    _handleClick(evt) {
        let a = evt.target;

        while (a && !a.matches(selector)) {
            a = a.parentNode;
            if (a === document.body) {
                return;
            }
        }
        this.log('click ', a.href);
        evt.preventDefault();
        this.router.setUrl(a.href);
    }
}
