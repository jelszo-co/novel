import React, { useState, useEffect } from 'react';
import { Redirect, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

import Title from '../components/Title';
import Menu from '../components/Menu';

import { setPopup } from '../../actions/popup';
import { auth } from '../../firebase';

import '../../css/user/profile.scss';
import axios from 'axios';

const Profile = ({ user: { name, role, fUser }, setPopup }) => {
  const { t } = useTranslation();
  const [favs, setFavs] = useState([]);

  useEffect(() => {
    axios
      .get(process.env.REACT_APP_SRV_ADDR + '/novel/favorites')
      .then(res => setFavs(res.data))
      .catch(err => console.error(err));
  }, []);

  const { email, emailVerified } = fUser;
  const sendEmail = async () => {
    try {
      await fUser.sendEmailVerification();
      setPopup('Email sikeresen elküldve.');
    } catch (err) {
      console.error(err);
      setPopup('Hiba az email küldése közben.', 'err');
    }
  };

  return role === 'user' ? (
    <div id='profile'>
      <Menu />
      <Title>{t('profile_title')}</Title>
      <div className='content-wrapper'>
        <div className='col-side'>
          <div className='col-item col-item-left border-left'>
            <p className='name'>{name}</p>
            <p className='email'>
              {email}{' '}
              {!emailVerified && (
                <button
                  type='button'
                  className='email-confirm'
                  onClick={() => sendEmail()}
                >
                  {t('profile_email_confirm')}
                </button>
              )}
            </p>
            <Link to='/update-email' className='change-upleft'>
              {t('profile_change_general')}
            </Link>
          </div>
          <div className='col-item col-item-left'>
            <div className='border-left'>
              <Link to='/update-pass'>{t('profile_change_password')}</Link>
              <Link to='/delete'>{t('profile_delete_account')}</Link>
            </div>
          </div>
        </div>
        <div className='col-center'>
          <h3>{t('profile_last_comments')}</h3>
        </div>
        <div className='col-side'>
          <div className='col-item col-item-right'>
            <p className='fav-title'>{t('profile_fav_novels')}</p>
            <div className='fav-novels'>
              {favs.map(fav => (
                <Link to={fav.path}>{fav.title}</Link>
              ))}
            </div>
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

Profile.propTypes = {
  user: PropTypes.object.isRequired,
  setPopup: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  user: state.user,
});

export default connect(mapStateToProps, { setPopup })(Profile);
