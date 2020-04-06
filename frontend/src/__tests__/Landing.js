/* eslint-disable */
import React from 'react';
import { mount } from 'enzyme';
import { Router, Link } from 'react-router-dom';
import { createMemoryHistory } from 'history';

import Landing from '../pages/Landing';

test('Link points to /list', () => {
  const history = createMemoryHistory();
  const wrapper = mount(
    <Router history={history}>
      <Landing />
    </Router>,
  );
  const link = wrapper.find(Link);
  link.simulate('click', { button: 0 });
  wrapper.update();
  expect(history.location.pathname).toBe('/list');
});
