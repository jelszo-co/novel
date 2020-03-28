import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import '../css/all/404.scss';

const Err = () => {
  const { t } = useTranslation();
  return (
    <div id='err'>
      <div className='error-wrapper'>
        <h1>404</h1>
        <p>{t('err_body')}</p>
      </div>
      <Link to='/'>{t('menu_home')}</Link>
    </div>
  );
};

export default Err;
