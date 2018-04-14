const html = ({ url, item, turbolink }) => `
<h1 class="headline">
    ${turbolink.render(url, `
        <img class="headline__media" src="${item.image.tbUrl}" alt="${item.titleNoFormatting}" />
        <span class="headline__text">${item.title}</span>`,
        ['headline__turbolink'])}
</h1>
`;

export default class HeadlineComponent {
    constructor(app) {
        this._app = app;
    }

    render(url, item) {
        return html({ url, item, turbolink: this._app.turbolink });
    }
}
