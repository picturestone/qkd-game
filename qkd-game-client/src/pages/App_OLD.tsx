import React from 'react';
import logo from './logo.svg';
import './App_OLD.css';
import Sender from '../components/game/Sender';
import { Link } from 'react-router-dom';

// TODO remove this file. Its only here to see how images can be integrated well.

function AppOLD() {
    return (
        <div className="App">
            <ul>
                <li>
                    <Link to="/">Home</Link>
                </li>
                <li>
                    <Link to="/lobbies">Lobbies</Link>
                </li>
            </ul>

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
        </div>
    );
}

export default AppOLD;
