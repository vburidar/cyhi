import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Container,
  Typography,
} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  footer: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    right: 0,
    padding: theme.spacing(1),
    marginTop: 'auto',
    backgroundColor:
      theme.palette.type === 'dark' ? theme.palette.grey[800] : theme.palette.grey[200],
  },
}));

export default function Footer() {
  const classes = useStyles();

  return (
    <footer className={classes.footer}>
      <Container maxWidth="sm">
        <Typography variant="body1" align="center">
          Made by vburidar
        </Typography>
        <Typography variant="body2" color="textSecondary" align="center">
          {'Copyright © '}
          {` ${new Date().getFullYear()}.`}
        </Typography>
      </Container>
    </footer>
  );
}