import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Switch from '@material-ui/core/Switch';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexGrow: 1,
    alignItems: 'center',
    padding: theme.spacing(0.5),
  },
  chipContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    flexGrow: 1,
  },
  chip: {
    margin: theme.spacing(0.5),
  },
  toggleContainer: {
    display: 'flex',
  },
  toggle: {
    width: 'auto',
    flexWrap: 'nowrap',
    margin: theme.spacing(0, 0.5),
  },
  toggleItem: {
    color: theme.palette.text.secondary,
  },
  divider: {
    width: 1,
    height: 46,
    margin: 4,
  },
}));

export const Tags = ({
  isDisabled,
  tagMode,
  tags = [],
  onTagMode,
  onDelete,
  onClear,
}) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div className={classes.chipContainer}>
        {tags.map(data => {
          const handleDelete = () => { onDelete(data); };

          return (
            <Chip
              key={data}
              label={data}
              onDelete={handleDelete}
              className={classes.chip}
            />
          );
        })}
      </div>

      {tags.length > 1
        ?
          <div className={classes.toggleContainer}>
            <Grid
              container
              component="label"
              className={classes.toggle}
              alignItems="center"
              spacing={1}
            >
              <Grid item>
                <Typography variant="button" className={classes.toggleItem}>Any</Typography>
              </Grid>
              <Grid item>
                <Switch
                  disabled={isDisabled}
                  checked={tagMode === 'all'}
                  onChange={onTagMode}
                />
              </Grid>
              <Grid item>
                <Typography variant="button" className={classes.toggleItem}>All</Typography>
              </Grid>
            </Grid>
            <Divider className={classes.divider} />
          </div>
        : null}

      <IconButton
        title="Reset"
        aria-label="Reset"
        disabled={isDisabled}
        onClick={onClear}
      >
        <CloseIcon />
      </IconButton>
    </div>
  );
}
