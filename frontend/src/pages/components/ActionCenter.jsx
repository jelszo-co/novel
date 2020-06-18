import React from 'react';
import { Redirect } from 'react-router-dom';

import useQuery from './useQuery';

const ActionCenter = () => {
  const query = useQuery();
  sessionStorage.setItem('oobCode', query.get('oobCode'));
  switch (query.get('mode')) {
    case 'resetPassword':
      return <Redirect to='/reset-pass' />;
    default:
      return null;
  }
};

export default ActionCenter;
