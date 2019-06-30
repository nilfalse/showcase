import React, { Component } from 'react';

import Uberbar from './components/Uberbar';
import { FlickrPhotoStream } from './components/FlickrPhotoStream';

import * as flickr from './api/flickr';

export class App extends Component {
  state = {
    title: '',
    status: 'idle',
    tagMode: 'all',
    tags: [],
    items: [],
  };

  componentDidMount () {
    this.loadItems();
    this.setState({ title: 'loading' });
  }

  render () {
    const isLoading = this.state.status === 'loading';

    return (
      <main>
        <Uberbar
          isLoading={isLoading}
          title={this.state.title}
          tagMode={this.state.tagMode}
          tags={this.state.tags}
          onTagMode={this.handleTagMode}
          onTagsChange={this.loadItems}
        />

        <FlickrPhotoStream
          isLoading={isLoading}
          title={this.state.title}
          items={this.state.items}
          onRefresh={this.loadItems}
        />
      </main>
    );
  }

  handleTagMode = (evt, tagMode) => {
    this.loadItems(this.state.tags, tagMode ? 'all' : 'any');
  }

  loadItems = async (tags = this.state.tags, tagMode = this.state.tagMode) => {
    this.setState({
      status: 'loading',
      tagMode,
      tags,
    });

    try {
      this.handleItemsLoaded(await flickr.getFeed(tags, tagMode));
    } catch (err) {
      this.setState({ status: 'error' });
    }
  }

  handleItemsLoaded (feed) {
    console.log(new Date(), feed);

    document.title = feed.title;
    this.setState({
      title: feed.title,
      status: 'idle',
      items: feed.items,
    });
  }
}
