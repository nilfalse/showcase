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

export default class HomePage extends Page {
    constructor(router) {
        super(router);
        this.log = this.app.getLogger('nilfalse:homepage');
        this.log('init');
        this.paranja = this.app.paranja;
        this.storage = this.app.storage;

        this.navigation = new NavigationComponent(this.app);
        this.searchField = new SearchFieldComponent(this.app);
        this.headline = new HeadlineComponent(this.app);
        this.navigation.setSearchField(this.searchField);
        this.storage.getState()
            .then(results => this.render(results));

        this.searchField.on('search', val => {
            this.log('search ', val);
            router.setUrl('./search?q=' + encodeURIComponent(val));
        });
    }

    render(items) {
        const headlines = items
            .map((item, idx) => this.headline.render('./stories/' + idx, item))
            .join('');
        this.app.title = '';

        this.app.render(
            html({
                navigation: this.navigation.render(),
                headlines
            }));
        this.paranja.remove();
        this.log('rendered');
    }

    dispose() {
        this.paranja.render();
        return super.dispose();
    }
}
