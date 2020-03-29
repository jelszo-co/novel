import React from 'react';

import Title from './components/Title';
import Menu from './components/Menu';
import { useTranslation } from 'react-i18next';

const Login = () => {
  const { t } = useTranslation();
  return (
    <div>
      <Title>Fiók</Title>
      <Menu />
    </div>
  );
};

export default Login;
