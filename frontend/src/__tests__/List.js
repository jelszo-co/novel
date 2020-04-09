/* eslint-disable */
import React from 'react';
import { shallow } from 'enzyme';
import { Provider } from 'react-redux';
import store from '../store';

import List from '../pages/List';

it('Renders without crashing', () => {
  shallow(
    <Provider store={store}>
      <List />
    </Provider>,
  );
});
