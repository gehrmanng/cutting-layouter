/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable react/jsx-filename-extension */
/* eslint-disable react/react-in-jsx-scope */
import React from 'react';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { Provider } from 'react-redux';
import { I18nProvider } from '@gehrmanng/react-i18n';
import configureStore from 'redux-mock-store';

configure({ adapter: new Adapter() });

const mockStore = configureStore([]);
const store = mockStore({ items: [], materials: [] });

global.mount = component => {
  return mount(
    <Provider store={store}>
      <I18nProvider defaultLanguage="en_US" translations={{}}>
        {component}
      </I18nProvider>
    </Provider>,
  );
};
