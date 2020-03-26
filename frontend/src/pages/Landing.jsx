import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import '../css/all/landing.scss';

const Landing = () => {
  const { t } = useTranslation();
  return (
    <div id='landing'>
      <h1>{t('landing_welcome')}</h1>
      <p>{t('landing_about')}</p>
      <Link to='/list' className='button'>
        {t('landing_button')}
      </Link>
    </div>
  );
};
export default Landing;
