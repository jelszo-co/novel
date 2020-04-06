/* eslint-disable */
import React from 'react';
import { shallow } from 'enzyme';
import { Route } from 'react-router';

import App from './App';
import Landing from './pages/Landing';
import List from './pages/List';
import Contact from './pages/Contact';
import err404 from './pages/404';

const wrapper = shallow(<App />);
const pathMap = wrapper.find(Route).reduce((pathMap, route) => {
  const routeProps = route.props();
  pathMap[routeProps.path] = routeProps.component;
  return pathMap;
}, {});

test('renders without crashing', () => {
  shallow(<App />);
});

describe('routes point to correct component', () => {
  test('should show Landing for /', () => expect(pathMap['/']).toBe(Landing));
  test('should show list for /list', () => expect(pathMap['/list']).toBe(List));
  test('should show contact for /contact', () =>
    expect(pathMap['/contact']).toBe(Contact));

  test('should show 404 for undefined', () =>
    expect(pathMap['undefined']).toBe(err404));
});
