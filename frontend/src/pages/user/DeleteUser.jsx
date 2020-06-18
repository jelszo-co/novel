import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { withRouter } from 'react-router-dom';
import { auth } from '../../firebase';
import { connect } from 'react-redux';

import { setPopup } from '../../actions/popup';
import axios from 'axios';

import Title from '../components/Title';

import '../../css/user/deleteUser.scss';
import cookie from 'react-cookies';

const DeleteUser = ({ setPopup, history }) => {
  const { t } = useTranslation();
  const [pass, setPass] = useState('');

  const alertUser = () => {
    const f = document.querySelector('input[type="password"]');
    f.style.color = '#ab1717';
    f.style.borderColor = '#ab1717';
    setTimeout(() => {
      f.style.borderColor = '#ffffff';
      f.style.color = '#ffffff';
    }, 500);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (pass === '') return alertUser();
    try {
      const user = auth().currentUser;
      const credential = auth.EmailAuthProvider.credential(user.email, pass);
      await user.reauthenticateWithCredential(credential);
      await user.delete();
      await axios.delete(process.env.REACT_APP_SRV_ADDR + '/user/');
      cookie.remove('usertoken');
      setPopup('Fiók sikeresen törölve.');
    } catch (err) {
      if (err.code === 'auth/wrong-password') {
        alertUser();
      } else {
        console.error(err);
        setPopup('Hiba a felhasználó törlése közben.', 'err');
      }
    }
  };

  return (
    <div id='delete'>
      <button onClick={() => history.goBack()} className='back'>
        {t('back')}
      </button>
      <Title>{t('delete_title')}</Title>
      <form onSubmit={e => handleSubmit(e)} noValidate>
        <p>{t('delete_lore')}</p>
        <input
          type='password'
          autoComplete='current-password'
          autoCorrect='off'
          placeholder={t('current_password')}
          value={pass}
          onChange={e => setPass(e.target.value)}
        />
        <input type='submit' value={t('delete')} />
      </form>
    </div>
  );
};

export default connect(null, { setPopup })(withRouter(DeleteUser));
