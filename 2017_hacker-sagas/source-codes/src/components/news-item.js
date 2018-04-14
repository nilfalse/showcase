import React from 'react';

import './news-item.css';


export default function NewsItem (props) {
    const story = props.story;
    const author = props.author;

    return (
        <article className="stories__item" key={story.id}>
            <h1>
                <a href={story.url} target="_blank">{story.title}</a>
            </h1>
            <time>on {new Date(story.time * 1000).toDateString()}</time>
            { ' ' }
            [<a href={`https://news.ycombinator.com/item?id=${story.id}`} target="_blank">see&nbsp;discussion</a>]
            <p>
                {story.score}&nbsp;points
            </p>
            <p>by @{author.id} <span className="author__karma">(with total karma of {author.karma} points)</span></p>
        </article>
    );
}
