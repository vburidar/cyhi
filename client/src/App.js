import React from 'react';
import Typography from '@material-ui/core/Typography';
import './App.css';
import Exercise from './Exercise';

function App() {
  return (
    <div className="App">
      <Typography variant="h4">Can you hear it?</Typography>
      <Exercise />
    </div>
  );
}

export default App;
