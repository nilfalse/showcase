import NavigationComponent from '../components/navigation';
import SearchFieldComponent from '../components/search-field';
import HeadlineComponent from '../components/headline';
import Page from '../core/page';


const html = ctx => `
${ctx.navigation}
<section class="headlines">
    ${ctx.headlines}
</section>
`;

const noHeadlinesFound = () => `
<p class="headlines__no-headlines-found">No stories found</p>
`;

export default class SearchPage extends Page {
    constructor(router) {
        super(router);
        this.log = this.app.getLogger('nilfalse:search');
        this.log('init');

        this._router = router;
        this.paranja = this.app.paranja;

        const IndexedStorage = router.getPayload('source');
        this.storage = new IndexedStorage(this.app.storage);

        this.navigation = new NavigationComponent(this.app);
        this.searchField = new SearchFieldComponent(this.app);
        this.headline = new HeadlineComponent(this.app);

        this._setupSearchField();
        this.searchField.setFocus();
        this.navigation.setSearchField(this.searchField);
        this.render();
        this.renderHeadlines();
    }

    render() {
        this.app.title = this._router.getParams().q + ' / search';
        this.app.render(
            html({
                navigation: this.navigation.render(),
                headlines: ''
            }));
        this.paranja.remove();
        this.log('rendered');
    }

    renderHeadlines() {
        const node = this.app.root.querySelector('.headlines');
        if (!node) {
            return;
        }
        const term = this._router.getParams().q;
        return this.storage.getFilteredState(term)
            .then(items => items
                .map((item, idx) => this.headline.render(item.localUrl, item)))
            .then(items => node.innerHTML =
                items.length > 0 ? items.join('') : noHeadlinesFound());
    }

    handleRouteChange() {
        this.log('handle route change');
        this.searchField.setValue(this._router.getParams().q);
        this.renderHeadlines();
        this.app.title = 'search / ' + this._router.getParams().q;
    }

    dispose() {
        this.paranja.render();
        return super.dispose();
    }

    _setupSearchField() {
        this.searchField.on('reset', () => {
            this.log('search reset');
            this._router.setUrl('./');
        });
        this.searchField.on('search', term => {
            this.log('search ' + term);
            this._router.setUrl('./search?q=' + encodeURIComponent(term), { replace: true });
        });
    }
}
