import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import axios from 'axios';
import { StoreProvider } from './Store.jsx';
import {HelmetProvider} from 'react-helmet-async';

axios.defaults.baseURL = 'http://localhost:8080';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
  <StoreProvider>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </StoreProvider>
</React.StrictMode>
)
