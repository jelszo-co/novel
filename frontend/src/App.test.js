/* eslint-disable */
import React from 'react';
import { shallow } from 'enzyme';
import App from './App';

test('renders without crashing', () => {
  const wrapper = shallow(<App />);
  const textNode = wrapper.find("[data-test='landing-title']");
  expect(textNode.length).toBe(1);
});
