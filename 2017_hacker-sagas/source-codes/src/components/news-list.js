import React from 'react';

import NewsItem from './news-item';


export default function NewsList (props) {
    let stories,
        classNames = props.mixin + ' stories';

    if (props.news.length > 0) {
        stories = props.news.map(item => {
            return <NewsItem key={item.id} story={item.story} author={item.author} />
        });
    } else {
        classNames += ' stories_empty';
        stories = <article className="stories__message">No stories to show yet</article>
    }

    return (
        <section className={classNames}>
            {stories}
        </section>
    );
}
