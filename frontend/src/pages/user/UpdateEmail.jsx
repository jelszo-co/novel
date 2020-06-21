import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

import { auth } from '../../firebase';
import { setPopup } from '../../actions/popup';

import Title from '../components/Title';

import '../../css/user/smallForms.scss';

const UpdateEmail = ({ setPopup, history }) => {
  const { t } = useTranslation();

  const [formData, setFormData] = useState({ name: '', email: '', pass: '' });
  const { name, email, pass } = formData;

  const alertColor = '#ab1717';
  const emailPatt = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/g;

  const alertUser = field => {
    const sc = `input[name=${field}]`;
    document.querySelector(sc).style.borderColor = alertColor;
    document.querySelector(sc).style.color = alertColor;
    setTimeout(() => {
      document.querySelector(sc).style.borderColor = '#fff';
      document.querySelector(sc).style.color = '#fff';
    }, 800);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (email === '' || pass === '') {
      if (email === '') alertUser('email');
      if (!email.match(emailPatt)) alertUser('email');
      if (pass === '') alertUser('password');
      return null;
    }
    if (!email.match(emailPatt)) return alertUser('email');
    const user = auth().currentUser;
    try {
      if (name !== '') {
        await axios.put(`${process.env.REACT_APP_SRV_ADDR}/user/`, { name });
      }
      const credential = auth.EmailAuthProvider.credential(user.email, pass);
      await user.reauthenticateWithCredential(credential);
      await user.updateEmail(email);
      setPopup(t('success_update_email'));
      history.goBack();
    } catch (err) {
      if (err.code === 'auth/wrong-password') {
        alertUser('password');
      } else {
        setPopup(t('err_update_email'), 'err');
        console.error(err);
      }
    }
    return null;
  };

  return (
    <div id='small-form'>
      <button type='button' onClick={() => history.goBack()} className='back'>
        {t('back')}
      </button>
      <Title>{t('update_email_title')}</Title>
      <form onSubmit={e => handleSubmit(e)} noValidate>
        <input
          type='text'
          name='name'
          autoComplete='name'
          autoCorrect='on'
          value={name}
          onChange={({ target }) =>
            setFormData({ ...formData, name: target.value })
          }
          placeholder={`${t('form_name')} (${t('unnecessary')})`}
        />
        <input
          type='email'
          name='email'
          autoComplete='email'
          autoCorrect='on'
          value={email}
          onChange={({ target }) =>
            setFormData({ ...formData, email: target.value })
          }
          placeholder={t('update_email_email')}
        />
        <input
          type='password'
          name='password'
          autoComplete='current-password'
          autoCorrect='off'
          value={pass}
          onChange={({ target }) =>
            setFormData({ ...formData, pass: target.value })
          }
          placeholder={t('current_password')}
        />
        <input type='submit' value={t('save')} />
      </form>
    </div>
  );
};

UpdateEmail.propTypes = {
  setPopup: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
};

export default connect(null, { setPopup })(withRouter(UpdateEmail));
