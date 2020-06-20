import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { auth } from '../../firebase';
import { setPopup } from '../../actions/popup';

import Title from '../components/Title';

import '../../css/user/smallForms.scss';

const ResetPass = ({ setPopup, history }) => {
  const { t } = useTranslation();

  const [formData, setFormData] = useState({ newPass1: '', newPass2: '' });
  const { newPass1, newPass2 } = formData;
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

  const alertUser = name => {
    const field = document.querySelector(`input[name=${name}]`);
    field.style.borderColor = alertColor;
    field.style.color = alertColor;
    setTimeout(() => {
      field.style.borderColor = '#fff';
      field.style.color = '#fff';
    }, 800);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (newPass1 === '' || newPass2 === '') {
      if (newPass1 === '') alertUser('new-pass-1');
      if (newPass2 === '') alertUser('new-pass-2');
      if (!valid.case || !valid.length || !valid.num) alertUser('new-pass-1');
      return null;
    }
    if (!valid.case || !valid.length || !valid.num)
      return alertUser('new-pass-1');
    if (newPass1 !== newPass2) return alertUser('new-pass-2');
    try {
      await auth().confirmPasswordReset(
        sessionStorage.getItem('oobCode'),
        newPass1,
      );
      setPopup('Jelszó sikeresen frissítve.');
      sessionStorage.clear();
      history.push('/login');
    } catch (err) {
      switch (err.code) {
        case 'auth/expired-action-code':
          setPopup('A link lejárt.', 'err');
          break;
        case 'auth/invalid-action-code':
          setPopup('Hibás link!', 'err');
          break;
        default:
          setPopup('Hiba az email megváltoztatása közben.', 'err');
          console.error(err);
          break;
      }
    }
    return null;
  };

  return (
    <div id='small-form'>
      <Title>{t('reset_pass_title')}</Title>
      <form onSubmit={e => handleSubmit(e)} noValidate>
        <input
          type='password'
          name='new-pass-1'
          autoComplete='new-password'
          autoCorrect='off'
          value={newPass1}
          placeholder={t('new_password')}
          onChange={({ target: { value } }) => {
            setFormData({ ...formData, newPass1: value });
            setValidState({
              length: value.length >= 6,
              case: value.match(pattLet),
              num: value.match(pattNum),
            });
          }}
          onFocus={() => changeValidator(1)}
          onBlur={() => changeValidator(0)}
        />
        <input
          type='password'
          name='new-pass-2'
          autoComplete='new-password'
          autoCorrect='off'
          value={newPass2}
          placeholder={t('new_password_confirm')}
          onChange={({ target: { value } }) =>
            setFormData({ ...formData, newPass2: value })
          }
        />
        <ul
          className='pass-validation pass-valid-reset'
          style={{ opacity: showValidator }}
        >
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

ResetPass.propTypes = {
  setPopup: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
};

export default connect(null, { setPopup })(withRouter(ResetPass));
