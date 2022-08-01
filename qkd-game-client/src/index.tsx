import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import Router from './Router';
import 'flowbite';
import { WithAxios } from './services/ApiService';

const container = document.getElementById('root') as HTMLElement;
const root = createRoot(container);

root.render(
    <React.StrictMode>
        <BrowserRouter>
            <WithAxios>
                <Router />
            </WithAxios>
        </BrowserRouter>
    </React.StrictMode>
);
