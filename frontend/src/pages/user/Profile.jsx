import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

import Title from '../components/Title';
import Menu from '../components/Menu';

import { setPopup } from '../../actions/popup';
import { auth } from '../../firebase';

import '../../css/user/profile.scss';

const Profile = ({ user: { name, role, fUser }, setPopup }) => {
  const { t } = useTranslation();
  const [activeNode, setActiveNode] = useState('');

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

  const deleteUser = async () => {
    try {
      await fUser.delete();
      setPopup('Fiók törölve.');
    } catch (err) {
      console.error(err);
      setPopup('Hiba a fiók törlése közben.', 'err');
    }
  };

  const showPopup = node => {
    const nodeEl = document.querySelector(`.${node}`);
    const popup = document.querySelectorAll('.profile-popup');
    if (node === activeNode) {
      nodeEl.style.opacity = 0;
      setActiveNode('');
      setTimeout(() => (nodeEl.style.display = 'none'), 200);
    } else {
      popup.forEach(p => (p.style.opacity = 0));
      setTimeout(() => {
        popup.forEach(p => (p.style.display = 'none'));
        nodeEl.style.display = 'block';
        setTimeout(() => (nodeEl.style.opacity = 1), 20);
        setActiveNode(node);
      }, 200);
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
            <button type='button' className='change-upleft'>
              {t('profile_change_general')}
            </button>
          </div>
          <div className='col-item col-item-left'>
            <p className='profile-popup delete-confirm border-left'>
              {t('profile_delete_confirm_msg')}{' '}
              <button type='button' onClick={() => showPopup('delete-confirm')}>
                {t('cancel')}
              </button>
              <button
                type='button'
                onClick={() => deleteUser()}
                className='dangerous'
              >
                {t('delete')}
              </button>
            </p>
            <div className='border-left'>
              <button type='button'>{t('profile_change_password')}</button>
              <button type='button' onClick={() => showPopup('delete-confirm')}>
                {t('profile_delete_account')}
              </button>
            </div>
          </div>
        </div>
        <div className='col-center'>
          <h3>{t('profile_last_comments')}</h3>
        </div>
        <div className='col-side'>
          <div className='col-item col-item-right'>
            <p className='fav-title'>{t('profile_fav_novels')}</p>
            <div className='fav-novels' />
          </div>
          <div className='col-item col-item-right'>
            <button
              type='button'
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
  name: PropTypes.string.isRequired,
  role: PropTypes.string.isRequired,
  fUser: PropTypes.object.isRequired,
  setPopup: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  user: state.user,
});

export default connect(mapStateToProps, { setPopup })(Profile);
