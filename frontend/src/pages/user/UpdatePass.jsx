import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { setPopup } from '../../actions/popup';
import { auth } from '../../firebase';

import Title from '../components/Title';

import '../../css/user/smallForms.scss';

const UpdatePass = ({ setPopup, history }) => {
  const { t } = useTranslation();

  const [formData, setFormData] = useState({ currentPass: '', newPass: '' });
  const { currentPass, newPass } = formData;
  const [valid, setValidState] = useState({
    length: false,
    case: false,
    num: false,
  });
  const [showValidator, changeValidator] = useState(0);

  const alertColor = '#ab1717';
  const grey = 'rgba(255, 255, 255, 0.7)';
  const pattLet = /(?=.*[a-z])(?=.*[A-Z]).{0,}/g;
  const pattNum = /([0-9])/g;

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
    if (currentPass === '' || newPass === '') {
      if (currentPass === '') alertUser('current-pass');
      if (newPass === '') alertUser('new-pass');
      if (!valid.case || !valid.length || !valid.num) alertUser('new-pass');
      return null;
    }
    if (!valid.case || !valid.length || !valid.num)
      return alertUser('new-pass');

    const user = auth().currentUser;
    try {
      const credential = auth.EmailAuthProvider.credential(
        user.email,
        currentPass,
      );
      await user.reauthenticateWithCredential(credential);
      await user.updatePassword(newPass);
      setPopup('Jelszó sikeresen frissítve.');
      history.goBack();
    } catch (err) {
      if (err.code === 'auth/wrong-password') {
        alertUser('password');
      } else {
        setPopup('Hiba az email megváltoztatása közben.', 'err');
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
      <Title>{t('update_pass_title')}</Title>
      <form onSubmit={e => handleSubmit(e)} noValidate>
        <input
          type='password'
          name='current-pass'
          autoComplete='current-password'
          autoCorrect='on'
          value={currentPass}
          onChange={({ target }) =>
            setFormData({ ...formData, currentPass: target.value })
          }
          placeholder={t('current_password')}
        />
        <input
          type='password'
          name='new-pass'
          autoComplete='current-password'
          autoCorrect='off'
          value={newPass}
          placeholder={t('new_password')}
          onChange={({ target: { value } }) => {
            setFormData({ ...formData, newPass: value });
            setValidState({
              length: value.length >= 6,
              case: value.match(pattLet),
              num: value.match(pattNum),
            });
          }}
          onFocus={() => changeValidator(1)}
          onBlur={() => changeValidator(0)}
        />
        <ul className='pass-validation' style={{ opacity: showValidator }}>
          <li>
            <p
              style={{
                color: valid.length ? grey : '#fff',
              }}
            >
              <span
                style={{
                  width: valid.length ? '100%' : '0%',
                }}
              />
              {t('form_val_1')}
            </p>
          </li>
          <li>
            <p
              style={{
                color: valid.case ? grey : '#fff',
              }}
            >
              <span
                style={{
                  width: valid.case ? '100%' : '0%',
                }}
              />
              {t('form_val_2')}
            </p>
          </li>
          <li>
            <p
              style={{
                color: valid.num ? grey : '#fff',
              }}
            >
              <span
                style={{
                  width: valid.num ? '100%' : '0%',
                }}
              />
              {t('form_val_3')}
            </p>
          </li>
        </ul>
        <input type='submit' value={t('save')} />
      </form>
    </div>
  );
};

UpdatePass.propTypes = {
  setPopup: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
};

export default connect(null, { setPopup })(withRouter(UpdatePass));
