import React, { useState } from 'react';
import { Redirect, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

import { auth } from '../../firebase';

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
        <div className='uploader'>
          <Uploader />
        </div>
      </div>
      <div className='panel panel-right'>
        <p className='panel-title'>{t('admin_banned_title')}</p>
        <Link to='/admin/banned' className='panel-link'>
          {t('admin_banned_link')}
        </Link>
      </div>
      <div className='account-management'>
        <button type='button'>{t('admin_account_email')}</button>
        <button type='button'>{t('admin_account_pass')}</button>
        <button type='button' onClick={() => auth().signOut()}>
          {t('profile_logout')}
        </button>
      </div>
    </div>
  ) : (
    <Redirect to='/login' />
  );
};

const Uploader = () => {
  const { t } = useTranslation();
  const [uploadState, setUploadState] = useState(0);
  const nextState = state => {
    const nodes = document.querySelectorAll('.uploader-node');
    console.log(nodes);
    nodes.forEach(node => (node.style.opacity = 0));
    setTimeout(() => {
      nodes.forEach(node => (node.style.display = 'none'));
      setUploadState(state);
      nodes.forEach(node => (node.style.display = 'block'));
      nodes.forEach(node => (node.style.opacity = 1));
    }, 300);
  };

  switch (uploadState) {
    case 0:
      return (
        <button
          type='button'
          className='uploader-node begin'
          onClick={() => nextState(1)}
        >
          {t('upload_begin')}
        </button>
      );

    default:
      return '';
  }
};

Admin.propTypes = {
  user: PropTypes.object.isRequired,
  role: PropTypes.string.isRequired,
};

const mapStateToProps = state => ({
  user: state.user,
});

export default connect(mapStateToProps)(Admin);
