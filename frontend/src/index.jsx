import React from 'react';
import ReactDOM from 'react-dom';
import * as Sentry from '@sentry/browser';
import * as serviceWorker from './serviceWorker';
import './i18n';

import App from './App';

if (process.env.NODE_ENV === 'production') {
  Sentry.init({
    dsn: 'https://c551d274f672470987b42eb6e4c41a5f@sentry.io/5173451',
    release: 'novel@' + process.env.npm_package_version,
  });
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root'),
);

serviceWorker.unregister();
