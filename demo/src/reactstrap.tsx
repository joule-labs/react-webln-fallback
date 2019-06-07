import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import ReactDOM from 'react-dom';
import ReactWebLNFallback from 'react-webln-fallback-reactstrap';
import App from './components/App';

ReactDOM.render(
  <App style="reactstrap" WebLNFallbackComponent={ReactWebLNFallback} />,
  document.getElementById('root') as HTMLElement,
);
