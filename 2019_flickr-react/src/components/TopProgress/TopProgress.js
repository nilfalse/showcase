import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';

const useStyles = makeStyles(theme => ({
  progressPlaceholder: {
    height: '4px',
  },
}));

export const TopProgress = ({
  isLoading,
}) => {
  const classes = useStyles();

  return isLoading
    ? <LinearProgress />
    : <div className={classes.progressPlaceholder} />;
};
