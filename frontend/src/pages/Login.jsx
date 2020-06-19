import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

import { auth, GProvider, FProvider } from '../firebase';
import { setPopup } from '../actions/popup';

import Title from './components/Title';
import Menu from './components/Menu';

import { ReactComponent as Google } from '../assets/google.svg';
import { ReactComponent as Facebook } from '../assets/facebook.svg';
import { ReactComponent as Eye } from '../assets/pass_eye.svg';
import { ReactComponent as EyeCross } from '../assets/pass_eye_cross.svg';

import '../css/all/login.scss';
import i18next from 'i18next';

const Login = ({ user, setPopup }) => {
  // STATE
  const { t } = useTranslation();
  const [registerData, setRegisterData] = useState({
    fullName: '',
    regEmail: '',
    regPass: '',
  });

  const [loginData, setLoginData] = useState({
    loginEmail: '',
    loginPass: '',
  });

  const [valid, setValidState] = useState({
    length: false,
    case: false,
    num: false,
  });
  const [showValidator, changeValidator] = useState(0);
  const [showPass, setShowPass] = useState(false);

  const [resetState, setResetState] = useState('login');
  const [loginResponse, setLoginResponse] = useState('');

  const { fullName, regEmail, regPass } = registerData;
  const { loginEmail, loginPass } = loginData;

  // FUNCTIONS
  const changeResetMode = state => {
    document
      .querySelectorAll('.form-group-login-animated')
      .forEach(group => (group.style.opacity = 0));
    setTimeout(() => {
      setResetState(state);
      document
        .querySelectorAll('.form-group-login-animated')
        .forEach(group => (group.style.opacity = 1));
    }, 200);
  };

  const alertColor = '#ab1717';
  const emailPatt = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/g;

  const alertUser = (field, expires = true) => {
    const sc = `input[name=${field}]`;
    document.querySelector(sc).style.borderColor = alertColor;
    document.querySelector(sc).style.color = alertColor;
    if (expires) {
      setTimeout(() => {
        document.querySelector(sc).style.borderColor = '#fff';
        document.querySelector(sc).style.color = '#fff';
      }, 800);
    }
  };

  const alertLogin = msg => {
    setLoginResponse(msg);
    document.querySelector('.login-response').style.opacity = 1;
    setTimeout(() => {
      document.querySelector('.login-response').style.opacity = 0;
      setTimeout(() => {
        setLoginResponse('');
      }, 200);
    }, 2500);
  };

  const handleRegister = async e => {
    e.preventDefault();
    if (fullName.length === 0) return alertUser('fullName');
    if (!regEmail.match(emailPatt)) return alertUser('regEmail');
    if (!valid.length || !valid.case || !valid.num) return alertUser('regPass');
    try {
      await auth().createUserWithEmailAndPassword(regEmail, regPass);
      await axios.put(`${process.env.REACT_APP_SRV_ADDR}/user/`, {
        name: fullName,
      });
    } catch (err) {
      console.error(err);
      setPopup(t('err_register'), 'err');
    }
  };

  const handleGoogle = async () => {
    try {
      auth().languageCode = i18next.t(['locale_name', 'en']);
      const res = await auth().signInWithPopup(GProvider);
      await axios.put(`${process.env.REACT_APP_SRV_ADDR}/user/`, {
        name: res.user.displayName,
      });
    } catch (err) {
      console.error(err);
      setPopup(t('err_login'), 'err');
    }
  };

  const handleFB = async () => {
    try {
      auth().languageCode = i18next.t(['locale_name', 'en']);
      await auth().signInWithPopup(FProvider);
    } catch (err) {
      console.error(err);
      setPopup(t('err_login'), 'err');
    }
  };

  const handleLogin = async e => {
    e.preventDefault();
    let err = false;
    if (!loginEmail.match(emailPatt)) {
      err = true;
      alertUser('loginEmail');
    }
    if (loginPass.length === 0) {
      err = true;
      alertUser('loginPass');
    }
    if (!err) {
      try {
        await auth().signInWithEmailAndPassword(loginEmail, loginPass);
        setPopup(t('succes_login'));
      } catch (err) {
        alertUser('loginEmail');
        alertUser('loginPass');
        alertLogin(t('err_uname_pass'));
      }
    }
  };

  const handleForgot = async e => {
    e.preventDefault();
    if (loginEmail.match(emailPatt)) {
      try {
        await auth().sendPasswordResetEmail(loginEmail);
        changeResetMode('success');
      } catch (err) {
        if (err.code === 'auth/user-not-found') {
          alertUser('loginEmail');
          alertLogin(t('err_email'));
        }
        console.error(err);
      }
    } else {
      alertUser('loginEmail');
    }
  };

  const handleRegChange = ({ target: { name, value } }) => {
    const pattLet = /(?=.*[a-z])(?=.*[A-Z]).{0,}/g;
    const pattNum = /([0-9])/g;

    setRegisterData({ ...registerData, [name]: value });
    if (name === 'regPass') {
      setValidState({
        length: value.length >= 6,
        case: value.match(pattLet),
        num: value.match(pattNum),
      });
    }
  };

  const handleLoginChange = ({ target: { name, value } }) => {
    setLoginData({ ...loginData, [name]: value });
  };

  const grey = 'rgba(255, 255, 255, 0.7)';

  // RETURN
  if (user.role === 'admin') return <Redirect to='/admin' />;
  if (user.role === 'user') return <Redirect to='/profile' />;
  return (
    <div id='login'>
      <Title>{t('login_title')}</Title>
      <Menu />
      <div id='login-social'>
        <Google
          title={t('login_google_title')}
          onClick={() => handleGoogle()}
          onKeyPress={() => handleGoogle()}
        />
        <Facebook
          title={t('login_fb_title')}
          onClick={() => handleFB()}
          onKeyPress={() => handleFB()}
        />
      </div>
      <div id='form-cont'>
        <form id='register-form' onSubmit={e => handleRegister(e)} noValidate>
          <h3 className='form-title'>{t('form_register_title')}</h3>
          <div className='form-group form-group-validator'>
            <input
              required
              name='fullName'
              type='text'
              autoComplete='name'
              autoCorrect='on'
              placeholder={t('form_name')}
              value={fullName}
              onChange={e => handleRegChange(e)}
            />
            <input
              required
              name='regEmail'
              type='email'
              autoComplete='email'
              autoCorrect='on'
              placeholder={t('form_email')}
              value={regEmail}
              onChange={e => handleRegChange(e)}
            />
            <input
              required
              name='regPass'
              id='reg-password'
              type={showPass ? 'text' : 'password'}
              autoComplete='new-password'
              autoCorrect='off'
              placeholder={t('form_password')}
              value={regPass}
              onChange={e => handleRegChange(e)}
              onFocus={() => changeValidator(1)}
              onBlur={() => changeValidator(0)}
            />
            <div className='show-pass'>
              <button
                type='button'
                onClick={() => setShowPass(false)}
                style={{ display: showPass ? 'block' : 'none' }}
              >
                <Eye className='show-pass-eye' />
              </button>
              <button
                type='button'
                onClick={() => setShowPass(true)}
                style={{ display: showPass ? 'none' : 'block' }}
              >
                <EyeCross />
              </button>
            </div>
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
          </div>

          <input type='submit' value={t('form_register_submit')} />
        </form>

        <form
          id='login-form'
          onSubmit={e => (resetState === 'login' ? handleLogin(e) : handleForgot(e))}
          noValidate
        >
          <h3 className='form-title'>{t('form_login_title')}</h3>

          {resetState === 'login' && (
            <div className='form-group-login form-group-login-animated'>
              <input
                required
                name='loginEmail'
                type='email'
                autoComplete='email'
                autoCorrect='on'
                placeholder={t('form_email')}
                value={loginEmail}
                onChange={e => handleLoginChange(e)}
              />
              <input
                required
                name='loginPass'
                type='password'
                autoComplete='current-password'
                autoCorrect='off'
                placeholder={t('form_password')}
                value={loginPass}
                onChange={e => handleLoginChange(e)}
              />
              <button
                type='button'
                className='forgot-button'
                onClick={() => changeResetMode('reset')}
                onKeyDown={() => changeResetMode('reset')}
              >
                {t('forgot_button')}
              </button>
              <p className='login-response'>&nbsp;{loginResponse}</p>
            </div>
          )}

          {resetState === 'reset' && (
            <div className='form-group-login form-group-login-animated'>
              <button
                type='button'
                className='forgot-back'
                onClick={() => changeResetMode('login')}
                onKeyDown={() => changeResetMode('login')}
              >
                {t('back')}
              </button>
              <input
                required
                name='loginEmail'
                type='email'
                autoComplete='email'
                autoCorrect='on'
                placeholder={t('form_email')}
                value={loginEmail}
                onChange={e => handleLoginChange(e)}
              />
              <p className='login-response'>&nbsp;{loginResponse}</p>
              <p className='forgot-instructions'>{t('forgot_instructions')}</p>
            </div>
          )}

          {resetState === 'success' && (
            <div className='form-group-login form-group-login-animated'>
              <p className='forgot-success'>{t('success')}</p>
            </div>
          )}

          <input
            type='submit'
            className='form-group-login-animated'
            value={
              resetState === 'login'
                ? t('form_login_submit')
                : resetState === 'reset'
                ? t('form_login_reset')
                : ''
            }
          />
        </form>
      </div>
    </div>
  );
};

const mapStateToProps = state => ({
  user: state.user,
});

export default connect(mapStateToProps, { setPopup })(Login);
