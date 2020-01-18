// Library imports
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { I18nProvider } from '@gehrmanng/react-i18n';

// Local component imports
import App from './App';

// Service, Redux store and styling imports
import * as serviceWorker from './serviceWorker';
import store from './store';
import './index.css';

// Language file import
import localizations from './i18n';

// Render the React app
ReactDOM.render(
  <Provider store={store}>
    <I18nProvider defaultLanguage="en_US" translations={localizations}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </I18nProvider>
  </Provider>,
  document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
