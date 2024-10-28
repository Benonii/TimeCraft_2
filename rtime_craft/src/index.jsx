import React from "react"
import ReactDOM from "react-dom/client"
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { QueryClientProvider } from '@tanstack/react-query';
import queryClient from './queryClient.ts';

import App from "./App"
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <StrictMode>
        <QueryClientProvider client={new queryClient}>
            <App />
        </QueryClientProvider>
    </StrictMode>,
);
