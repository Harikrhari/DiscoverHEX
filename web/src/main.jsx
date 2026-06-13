import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
      <Toaster
        position="top-right"
        toastOptions={{
          style: { background: '#1A1A2E', color: '#fff', borderRadius: '8px' },
          success: { iconTheme: { primary: '#27AE60', secondary: '#fff' } },
        }}
      />
    </BrowserRouter>
  </React.StrictMode>
);
