import React from 'react';
import ReactDOM from 'react-dom';
import ReactWebLNFallback, { paymentComplete } from 'react-webln-fallback-material-ui';
import App from './components/App';

ReactDOM.render(
  <App style="material-ui" WebLNFallbackComponent={ReactWebLNFallback} paymentComplete={paymentComplete} />,
  document.getElementById('root') as HTMLElement,
);
