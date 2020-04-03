import React from 'react';
import {Container, CssBaseline } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import './App.css';
import Exercise from './Exercise';
import Header from './Header';
import Footer from './Footer';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
  },
  main: {
    marginTop: theme.spacing(8),
    marginBottom: theme.spacing(2),
    textAlign: 'center',
  },
  footer: {
    padding: theme.spacing(3, 2),
    marginTop: 'auto',
    backgroundColor:
      theme.palette.type === 'light' ? theme.palette.grey[200] : theme.palette.grey[800],
  },
}));

function App() {
  const classes = useStyles();
  /*return (
    <div className={classes.root}>
      <Header />
      <Exercise />
      <Footer />
    </div>
  );*/

  return (
    <div className={classes.root}>
      <Header/>
      <CssBaseline />
      <Container component="main" className={classes.main} maxWidth="md">
        <Exercise/>
      </Container>
      <Footer/>
    </div>
  );
}

export default App;
