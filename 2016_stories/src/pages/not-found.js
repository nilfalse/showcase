import NavigationComponent from '../components/navigation';
import SearchFieldComponent from '../components/search-field';
import Page from '../core/page';


const html = (error = {message: ''}, ctx) => `
${ctx.navigation}
<article class="error-page">
    <h1 class="error-page__title">Page not found</h1>
    <p class="error-page__details">${error.message}</p>
</article>
`;

export default class NotFoundPage extends Page {
    constructor(router) {
        super(router);
        this.log = this.app.getLogger('nilfalse:not-found');
        this.log('init');

        this.searchField = new SearchFieldComponent(this.app);
        this.navigation = new NavigationComponent(this.app);
        this.paranja = this.app.paranja;
        this._setupSearchField();
        this.navigation.setSearchField(this.searchField);
    }

    render(error) {
        this.app.render(
            html(error, {
                navigation: this.navigation.render()
            }));
        this.paranja.remove();
        this.log('rendered');
    }

    dispose(route) {
        this.paranja.render();
        return super.dispose(route);
    }

    _setupSearchField() {
        this.searchField.on('reset', () => {
            this.log('search reset');
            this.app.router.setUrl('/');
        });
        this.searchField.on('search', term => {
            this.log('search ' + term);
            this.app.router.setUrl('/search?q=' + encodeURIComponent(term), { replace: true });
        });
    }
}
