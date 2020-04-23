import React from 'react';
import { Redirect, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';

import Title from '../components/Title';
import Menu from '../components/Menu';

import '../../css/admin/admin.scss';

const Admin = ({ user: { role } }) => {
  const { t } = useTranslation();
  return role === 'admin' ? (
    <div id='admin'>
      <Menu />
      <Title>Admin panel</Title>
      <div className='panel panel-left'>
        <p className='panel-title'>{t('admin_comments_title')}</p>
        <Link to='/list' className='panel-link'>
          {t('admin_comments_link')}
        </Link>
      </div>
      <div className='upload'>
        <p className='panel-title'>{t('admin_upload_title')}</p>
        <Uploader />
      </div>
      <div className='panel panel-right'>
        <p className='panel-title'>{t('admin_banned_title')}</p>
        <Link to='/admin/banned' className='panel-link'>
          {t('admin_banned_link')}
        </Link>
      </div>
      <div className='account-management'>
        <button>{t('admin_account_email')}</button>
        <button>{t('admin_account_pass')}</button>
      </div>
    </div>
  ) : (
    <Redirect to='/login' />
  );
};

const Uploader = () => {
  const { t } = useTranslation();
  return (
    <div className='uploader'>
      <button>{t('upload_begin')}</button>
    </div>
  );
};

const mapStateToProps = state => ({
  user: state.user,
});

export default connect(mapStateToProps)(Admin);