import React from 'react';
import logo from './logo.svg';
import './App.css';
import './game/PolarizationWheel';
import PolarizationWheel from './game/PolarizationWheel';
import PhotonSource from './game/PhotonSource';

function App() {
  return (
    <div className="App">
      {/* <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header> */}
      <PolarizationWheel />
      <PhotonSource />
    </div>
  );
}

export default App;
