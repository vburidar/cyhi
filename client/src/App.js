import React from 'react';
import Typography from '@material-ui/core/Typography';
import './App.css';
import Exercise from './Exercise';
import Header from './Header';
import Footer from './Footer';

function App() {
  return (
    <div className="App">
      <Header />
      <Exercise />
      <Footer />
    </div>
  );
}

export default App;
