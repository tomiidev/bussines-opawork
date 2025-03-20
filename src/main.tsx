import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App';
import './css/style.css';
import './css/satoshi.css';
import 'jsvectormap/dist/css/jsvectormap.css';
import 'flatpickr/dist/flatpickr.min.css';
import { ChatProviderSupabase } from './context/ctx';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <ChatProviderSupabase>

    <React.StrictMode>
      <Router>
        <App />
      </Router>
    </React.StrictMode>,
  </ChatProviderSupabase>
);
