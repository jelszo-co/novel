import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

import '../css/all/landing.scss';

import Menu from './components/Menu';

const Landing = () => {
  const [intro, setIntro] = useState('');
  const { t } = useTranslation();
  useEffect(() => {
    axios
      .get(
        process.env.REACT_APP_SRV_ADDR +
          '/introduction?lang=' +
          t('locale_name').toUpperCase(),
      )
      .then(res => setIntro(res.data));
  }, []);
  if (intro === '') return null;
  return (
    <>
      <Menu />
      <div id='landing'>
        <h1>{t('landing_welcome')}</h1>
        <p>{intro.introduction}</p>
        <Link to='/list' className='button'>
          {t('landing_button')}
        </Link>
      </div>
    </>
  );
};
export default Landing;
