import React from 'react';
import ReactDOM from 'react-dom';
import ReactWebLNFallback, { paymentComplete } from 'react-webln-fallback-semantic-ui';
import App from './components/App';
import 'semantic-ui-css/semantic.min.css';

ReactDOM.render(
  <App style="semantic-ui" WebLNFallbackComponent={ReactWebLNFallback} paymentComplete={paymentComplete} />,
  document.getElementById('root') as HTMLElement,
);
