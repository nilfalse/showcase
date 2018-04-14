const html = ctx => `
<nav class="navigation">
    ${ctx.turbolink.render('./', 'Home', ['navigation__home'])}
    ${ctx.search.render(ctx.searchTerm)}
</nav>
`;

export default class NavigationComponent {
    constructor(app) {
        this._app = app;
    }

    setSearchField(searchField) {
        this._search = searchField;
    }

    render() {
        const params = this._app.router.getParams();
        return html({
            turbolink: this._app.turbolink,
            search: this._search,
            searchTerm: params ? params.q : ''
        });
    }
}
