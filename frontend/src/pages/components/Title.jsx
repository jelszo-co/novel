import React from 'react';

import '../../css/components/title.scss';

const Title = ({ children, style }) => (
  <h2 className='title' style={style}>
    {children}
  </h2>
);

Title.defaultProps = {
  style: {},
};

export default Title;
