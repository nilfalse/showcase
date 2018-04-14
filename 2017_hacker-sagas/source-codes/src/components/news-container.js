import React, { Component } from 'react';

import Toolbar from './toolbar';
import NewsList from './news-list';
import './news-container.css';


class NewsContainer extends Component {
    componentDidMount () {
        this.props.actions.refresh();
    }

    render () {
        let classNames = 'content',
            mixin = 'content__stories',
            content;

        if (this.props.isFetching) {
            classNames += ' content_loading';
            content = 'Loading news ...';
        } else {
            content = <Toolbar onRefresh={this.props.actions.refresh} />;
        }

        return (
            <main className={classNames}>
                {content}
                <NewsList news={this.props.storiesToShow} mixin={mixin} />
            </main>
        );
    }
}

export default NewsContainer;
