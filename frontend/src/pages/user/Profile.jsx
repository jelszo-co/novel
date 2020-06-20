import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Redirect, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

import Title from '../components/Title';
import Menu from '../components/Menu';

import { setPopup } from '../../actions/popup';
import { auth } from '../../firebase';

import '../../css/user/profile.scss';

const Profile = ({ user: { name, role, fUser }, setPopup }) => {
  const { t } = useTranslation();
  const [favs, setFavs] = useState([]);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_SRV_ADDR}/novel/favorites`)
      .then(res => setFavs(res.data))
      .catch(err => console.error(err));
  }, []);

  const { email, emailVerified } = fUser;
  const sendEmail = async () => {
    try {
      await fUser.sendEmailVerification();
      setPopup(t('success_email_send'));
    } catch (err) {
      console.error(err);
      setPopup(t('err_email_send'), 'err');
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
              <Link
                className='profile-action'
                style={{ marginBottom: '10px' }}
                to='/update-pass'
              >
                {t('profile_change_password')}
              </Link>
              <Link className='profile-action' to='/delete'>
                {t('profile_delete_account')}
              </Link>
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
              {favs.length > 0 ? (
                favs.map(fav => <Link to={fav.path}>{fav.title}</Link>)
              ) : (
                <p className='no-fav'>{t('profile_no_fav')}</p>
              )}
            </div>
          </div>
          <div className='col-item col-item-right'>
            <button
              type='button'
              onClick={() => {
                auth().signOut();
                setPopup(t('success_logout'));
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
  setPopup: PropTypes.func.isRequired,
  user: PropTypes.shape({
    name: PropTypes.string.isRequired,
    role: PropTypes.oneOf(['admin', 'user', 'anonymous', 'stranger'])
      .isRequired,
    fUser: PropTypes.shape({
      email: PropTypes.string.isRequired,
      emailVerified: PropTypes.bool.isRequired,
      sendEmailVerification: PropTypes.func.isRequired,
    }),
  }).isRequired,
};

const mapStateToProps = state => ({
  user: state.user,
});

export default connect(mapStateToProps, { setPopup })(Profile);
