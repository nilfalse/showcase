import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

import { Search } from '../Search';
import { Tags } from '../Tags';
import { TopProgress } from '../TopProgress';

const styles = theme => ({
  root: {
    paddingTop: 64,
  },
  toolbar: {
    boxSizing: 'border-box',
    width: '100%',
    maxWidth: 768,
    margin: '0 auto',
  },
  title: {
    flexGrow: 1,
    paddingRight: theme.spacing(2),
  },
});

export class Uberbar extends Component {
  state = {
    searchTerm: '',
  }

  render () {
    const {
      classes,
      isLoading,
    } = this.props;

    return (
      <form className={classes.root} onSubmit={this.handleSubmit}>
        <AppBar>
          <Toolbar className={classes.toolbar}>
            <Typography variant="h6" className={classes.title}>
              Flickr&nbsp;Photos
            </Typography>
            <Search
              isDisabled={isLoading}
              text={this.state.searchTerm}
              onSearch={this.handleSearch}
            />
          </Toolbar>
        </AppBar>
        <TopProgress isLoading={isLoading} />
        {this.props.tags.length > 0
          ?
            <Toolbar className={classes.toolbar}>
              <Tags
                isDisabled={isLoading}
                tagMode={this.props.tagMode}
                tags={this.props.tags}
                onTagMode={this.props.onTagMode}
                onDelete={this.handleTagDelete}
                onClear={this.handleTagClear}
              />
            </Toolbar>
          : null}
      </form>
    );
  }

  handleSearch = (evt) => {
    this.setState({
      searchTerm: evt.target.value,
    });
  }

  handleTagDelete = (tagToDelete) => {
    this.handleTags(
      this.props.tags.filter(tag => tag !== tagToDelete)
    );
  }

  handleTagClear = () => {
    this.handleTags([]);
  }

  handleTags (tags) {
    if (this.props.isLoading) {
      return;
    }

    this.props.onTagsChange(tags);
  }

  handleSubmit = (evt) => {
    evt.preventDefault();
    if (this.props.isLoading) {
      return;
    }

    this.handleTags(
      this.props.tags.indexOf(this.state.searchTerm) >= 0
        ? this.props.tags
        : this.props.tags.concat(this.state.searchTerm)
    );
    this.setState({ searchTerm: '' });
  }
}

export default withStyles(styles)(Uberbar);
