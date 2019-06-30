import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import ListSubheader from '@material-ui/core/ListSubheader';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import RefreshIcon from '@material-ui/icons/Refresh';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    backgroundColor: theme.palette.background.paper,
    paddingBottom: theme.spacing(2),
  },
  gridTitle: {
    display: 'flex',
  },
  gridTitleText: {
    flexGrow: 1,
    paddingLeft: theme.spacing(2),
  },
  gridList: {
    width: '100%',
    maxWidth: 768,
  },
  icon: {
    color: 'rgba(255, 255, 255, 0.54)',
  },
  emptyTile: {
    display: 'flex',
    alignItems: 'center',
  },
  emptyTileParagraph: {
    width: '100%',
    textAlign: 'center',
    color: theme.palette.text.disabled,
  },
}));

export function FlickrPhotoStream ({
  title = '',
  items = [],
  isLoading,
  onRefresh,
}) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <GridList className={classes.gridList}>
        <ListSubheader key="title" className={classes.gridTitle} cols={2} style={{ height: 'auto' }}>
          <span className={classes.gridTitleText}>{title}</span>
          <IconButton
            title="Refresh"
            aria-label="Refresh"
            disabled={isLoading}
            onClick={() => onRefresh()}
          >
            <RefreshIcon />
          </IconButton>
        </ListSubheader>

        {items.map(tile => {
          return (
            <GridListTile key={tile.media.m}>
              <img src={tile.media.m} alt={tile.title} />
              <GridListTileBar
                title={tile.title}
                subtitle={<span>by: {tile.author}</span>}
                actionIcon={
                  <IconButton
                    aria-label={`info about ${tile.title}`}
                    className={classes.icon}
                    href={tile.link}
                    target="_blank"
                  >
                    <CloudDownloadIcon />
                  </IconButton>
                }
              />
            </GridListTile>
          );
        })}

        {isLoading
          ? [
            <GridListTile key="placeholder1" />,
            <GridListTile key="placeholder2" />,
            <GridListTile key="placeholder3" />,
            <GridListTile key="placeholder4" />
          ]
          : null}

        {items.length === 0 && !isLoading
          ?
            <GridListTile key="empty" cols={2} rows={2} classes={{ tile: classes.emptyTile }}>
              <Typography variant="h4" className={classes.emptyTileParagraph}>
                Oops, nothing found.
              </Typography>
            </GridListTile>
          : null}
      </GridList>
    </div>
  );
}
