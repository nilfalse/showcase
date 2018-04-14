import NavigationComponent from '../components/navigation';
import SearchFieldComponent from '../components/search-field';
import Page from '../core/page';

const html = (story, dateFormatter, nav) => `
${nav}
<article class="story">
    <h1 class="story__headline">${story.title}</h1>
    <time class="story__time" datetime="${story.publishedDate.toISOString()}" title="time is in your local timezone">
        ${dateFormatter.format(story.publishedDate)}
    </time>
    <p class="story__content">${story.content}</p>
    <p class="story__read-more">
        <a href="${story.unescapedUrl}" target="_blank">read more
            <span class="story__read-more-arrow"></span>
        </a>
    </p>
    ${relatedStories(story.relatedStories)}
    <figure class="story__media">
        <img class="story__media-image" src="${story.image.url}" alt="${story.titleNoFormatting}" />
        <figcaption class="story__media-title">${story.title}</figcaption>
    </figure>
</article>
`;

const relatedStory = story => `
<li class="related story__related-item">
    <span class="related__publisher">${story.publisher}:</span>
    <a href="${story.unescapedUrl}" class="related__link" target="_blank">
        ${story.title}
    </a>
</li>
`;

function relatedStories(stories = []) {
    return stories.length ? `
        <p class="story__related">See also</p>
        <ul class="story__related-list">
        ${stories.map(relatedStory).join('')}
        </ul>
        ` : '<p class="story__no-related-stories">No related stories</p>';
};

const dateSpec = '%b %d, %Y %H:%M';

export default class StoryPage extends Page {
    constructor(router) {
        super(router);
        this.log = this.app.getLogger('nilfalse:story');
        this.log('init');

        this.storage = this.app.storage;
        this.paranja = this.app.paranja;
        this.searchField = new SearchFieldComponent(this.app);
        this.navigation = new NavigationComponent(this.app);
        this.DateFormatter = router.getPayload('DateFormatter');

        this._setupSearchField();
        this.navigation.setSearchField(this.searchField);

        const params = router.getParams();
        this.storage.getStory(params.id)
        .then(
            story => this.render(story)
          , error => {
                if (404 === error.code) {
                    return router.emitNotFound(error);
                }
                return Promise.reject(error);
            });
    }

    render(story) {
        this.log(story);
        this.app.title = story.titleNoFormatting;
        this.app.render(
            html(
                story,
                new this.DateFormatter(dateSpec),
                this.navigation.render()));
        this.paranja.remove();
        this.log('rendered');
    }

    dispose() {
        this.paranja.render();
        return super.dispose();
    }

    _setupSearchField() {
        this.searchField.on('reset', () => {
            this.log('search reset');
            this.app.router.setUrl('../');
        });
        this.searchField.on('search', term => {
            this.log('search ' + term);
            this.app.router.setUrl('../search?q=' + encodeURIComponent(term));
        });
    }
}
