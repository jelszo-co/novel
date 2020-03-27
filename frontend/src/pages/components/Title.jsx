import React from 'react';
import PropTypes from 'prop-types';

import '../../css/components/title.scss';

const Title = ({ children }) => <h2 className='title'>{children}</h2>;

Title.propTypes = {
  children: PropTypes.string.isRequired,
};

export default Title;
