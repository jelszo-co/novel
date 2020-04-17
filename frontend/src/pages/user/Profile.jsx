import React from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import Title from '../components/Title';
import Menu from '../components/Menu';
import { useTranslation } from 'react-i18next';

import { setPopup } from '../../actions/popup';
import { auth } from '../../firebase';

import '../../css/user/profile.scss';

const Profile = ({
  user: {
    name,
    role,
    fUser: { email },
  },
  setPopup,
}) => {
  const { t } = useTranslation();
  return role === 'user' ? (
    <div id='profile'>
      <Menu />
      <Title>{t('profile_title')}</Title>
      <div className='content-wrapper'>
        <div className='col-side'>
          <div className='col-item col-item-left'>
            <p className='name'>{name}</p>
            <p className='email'>{email}</p>
            <button className='change-upleft'>
              {t('profile_change_general')}
            </button>
          </div>
          <div className='col-item col-item-left'>
            <button>{t('profile_change_password')}</button>
            <button>{t('profile_delete_account')}</button>
          </div>
        </div>
        <div className='col-center'>
          <h3>{t('profile_last_comments')}</h3>
        </div>
        <div className='col-side'>
          <div className='col-item col-item-right'>
            <p className='fav-title'>{t('profile_fav_novels')}</p>
            <div className='fav-novels'></div>
          </div>
          <div className='col-item col-item-right'>
            <button
              onClick={() => {
                auth().signOut();
                setPopup('Sikeres kijelentkezés.');
              }}
            >
              {t('profile_logout')}
            </button>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <Redirect to='/login' />
  );
};

const mapStateToProps = state => ({
  user: state.user,
});

export default connect(mapStateToProps, { setPopup })(Profile);
