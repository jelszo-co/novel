import React from 'react';
import { useTranslation } from 'react-i18next';

import Menu from './components/Menu';
import Title from './components/Title';

import '../css/all/contact.scss';

const Contact = () => {
  const { t } = useTranslation();
  return (
    <div id='contact'>
      <Menu />
      <Title style={{ top: '15%' }}>{t('contact_header')}</Title>
      <div className='card'>
        <p>
          {t('contact_name')}
          <span className='separator' />
          <span className='role'>{t('contact_role')}</span>
        </p>
        <a title={t('contact_send_mail')} href='mailto:martynnori@gmail.com'>
          martynnori@gmail.com
        </a>
      </div>
    </div>
  );
};

export default Contact;
