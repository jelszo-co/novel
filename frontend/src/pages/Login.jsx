import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { auth } from '../firebase';
import { setPopup } from '../actions/popup';

import Title from './components/Title';
import Menu from './components/Menu';

import { ReactComponent as Google } from '../assets/google.svg';
import { ReactComponent as Facebook } from '../assets/facebook.svg';
import { ReactComponent as Eye } from '../assets/pass_eye.svg';
import { ReactComponent as EyeCross } from '../assets/pass_eye_cross.svg';

import '../css/all/login.scss';

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

  const handleRegister = e => {
    e.preventDefault();
    let err = false;
    if (fullName.length === 0) {
      err = true;
      alertUser('fullName');
    }
    if (!regEmail.match(emailPatt)) {
      err = true;
      alertUser('regEmail');
    }
    if (!valid.length || !valid.case || !valid.num) {
      err = true;
      alertUser('regPass');
    }
    if (!err) {
      //register user
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
        setPopup('Sikeres bejelentkezés.');
      } catch (err) {
        alertUser('loginEmail');
        alertUser('loginPass');
        alertLogin('Hibás felhasználónév vagy jelszó!');
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
          alertLogin('Nem található ilyen e-mail cím.');
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
  return user.role === 'admin' ? (
    <Redirect to='/admin' />
  ) : user.role === 'user' ? (
    <Redirect to='/profile' />
  ) : (
    <div id='login'>
      <Title>{t('login_title')}</Title>
      <Menu />
      <div id='login-social'>
        <Google
          title={t('login_google_title')}
          onClick={() => {}}
          onKeyPress={() => {}}
        />
        <Facebook
          title={t('login_fb_title')}
          onClick={() => {}}
          onKeyPress={() => {}}
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
          onSubmit={e =>
            resetState === 'login' ? handleLogin(e) : handleForgot(e)
          }
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
