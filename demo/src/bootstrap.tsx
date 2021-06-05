import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import ReactDOM from 'react-dom';
import ReactWebLNFallback, { paymentComplete } from 'react-webln-fallback-bootstrap';
import App from './components/App';

ReactDOM.render(
  <App style="bootstrap" WebLNFallbackComponent={ReactWebLNFallback} paymentComplete={paymentComplete} />,
  document.getElementById('root') as HTMLElement,
);
