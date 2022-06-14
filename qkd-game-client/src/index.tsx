import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import Router from './Router';
import 'flowbite';
import { WithAxios } from './services/ApiService';

ReactDOM.render(
    <React.StrictMode>
        <BrowserRouter>
            <WithAxios>
                <Router />
            </WithAxios>
        </BrowserRouter>
    </React.StrictMode>,
    document.getElementById('root')
);
