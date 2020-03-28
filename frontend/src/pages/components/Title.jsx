import React from 'react';
import PropTypes from 'prop-types';

import '../../css/components/title.scss';

const Title = ({ children, style }) => (
  <h2 className='title' style={style}>
    {children}
  </h2>
);

Title.defaultProps = {
  style: {},
};

Title.propTypes = {
  children: PropTypes.string.isRequired,
  style: PropTypes.objectOf(PropTypes.object()),
};

export default Title;
