import React from 'react';
import ReactDOM from 'react-dom';
import ReactWebLNFallback, { paymentComplete } from 'react-webln-fallback-antd';
import App from './components/App';

ReactDOM.render(
  <App style="antd" WebLNFallbackComponent={ReactWebLNFallback} paymentComplete={paymentComplete} />,
  document.getElementById('root') as HTMLElement,
);
