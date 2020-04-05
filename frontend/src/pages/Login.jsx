import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

import Title from './components/Title';
import Menu from './components/Menu';

import { ReactComponent as Google } from '../assets/google.svg';
import { ReactComponent as Facebook } from '../assets/facebook.svg';

import '../css/all/login.scss';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fullName: '',
      regEmail: '',
      regPass: '',
      loginEmail: '',
      loginPass: '',
      valid1: false,
      valid2: false,
      valid3: false,
      showValidator: 0,
      didForgotPass: false,
    };
  }

  changeResetMode() {
    document.querySelector('.form-group-forgot-pass').style.opacity = 0;
    document.querySelector('#login-form input[type=submit]').style.opacity = 0;
    setTimeout(() => {
      this.setState({ didForgotPass: !this.state.didForgotPass });
      document.querySelector('.form-group-forgot-pass').style.opacity = 1;
      document.querySelector(
        '#login-form input[type=submit]',
      ).style.opacity = 1;
    }, 200);
  }

  render() {
    const {
      fullName,
      regEmail,
      regPass,
      loginEmail,
      loginPass,
      showValidator,
      valid1,
      valid2,
      valid3,
      didForgotPass,
    } = this.state;
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
    const handleRegister = (e) => {
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
      if (!valid1 || !valid2 || !valid3) {
        err = true;
        alertUser('regPass');
      }
      if (!err) {
        // Handle firebase here
      }
    };
    const handleLogin = (e) => {
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
        // Handle firebase here
      }
    };

    const handleChange = ({ target: { name, value } }) => {
      const pattLet = /(?=.*[a-z])(?=.*[A-Z]).{0,}/g;
      const pattNum = /([0-9])/g;

      this.setState({
        [name]: value,
      });
      if (name === 'regPass') {
        this.setState({
          valid1: value.length >= 8,
          valid2: value.match(pattLet),
          valid3: value.match(pattNum),
        });
      }
    };

    const { t } = this.props;

    const grey = 'rgba(255, 255, 255, 0.7)';

    return (
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
          <form
            id='register-form'
            onSubmit={(e) => handleRegister(e)}
            noValidate
          >
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
                onChange={(e) => handleChange(e)}
              />
              <input
                required
                name='regEmail'
                type='email'
                autoComplete='email'
                autoCorrect='on'
                placeholder={t('form_email')}
                value={regEmail}
                onChange={(e) => handleChange(e)}
              />
              <input
                required
                name='regPass'
                id='reg-password'
                type='password'
                autoComplete='new-password'
                autoCorrect='off'
                placeholder={t('form_password')}
                value={regPass}
                onChange={(e) => handleChange(e)}
                onFocus={() => this.setState({ showValidator: 1 })}
                onBlur={() => this.setState({ showValidator: 0 })}
              />
              <ul
                className='pass-validation'
                style={{ opacity: showValidator }}
              >
                <li>
                  <p
                    style={{
                      color: valid1 ? grey : '#fff',
                    }}
                  >
                    <span
                      style={{
                        width: valid1 ? '100%' : '0%',
                      }}
                    />
                    {t('form_val_1')}
                  </p>
                </li>
                <li>
                  <p
                    style={{
                      color: valid2 ? grey : '#fff',
                    }}
                  >
                    <span
                      style={{
                        width: valid2 ? '100%' : '0%',
                      }}
                    />
                    {t('form_val_2')}
                  </p>
                </li>
                <li>
                  <p
                    style={{
                      color: valid3 ? grey : '#fff',
                    }}
                  >
                    <span
                      style={{
                        width: valid3 ? '100%' : '0%',
                      }}
                    />
                    {t('form_val_3')}
                  </p>
                </li>
              </ul>
            </div>

            <input type='submit' value={t('form_register_submit')} />
          </form>

          <form id='login-form' onSubmit={(e) => handleLogin(e)} noValidate>
            <h3 className='form-title'>{t('form_login_title')}</h3>
            <div className='form-group'>
              <p
                className='forgot-back'
                onClick={() => this.changeResetMode()}
                style={{ opacity: didForgotPass ? 1 : 0 }}
              >
                {t('forgot_back')}
              </p>
              <input
                required
                name='loginEmail'
                type='email'
                autoComplete='email'
                autoCorrect='on'
                placeholder={t('form_email')}
                value={loginEmail}
                onChange={(e) => handleChange(e)}
              />
              <div className='form-group-forgot-pass'>
                {!didForgotPass ? (
                  <>
                    <input
                      required
                      name='loginPass'
                      type='password'
                      autoComplete='current-password'
                      autoCorrect='off'
                      placeholder={t('form_password')}
                      value={loginPass}
                      onChange={(e) => handleChange(e)}
                    />
                    <p
                      className='forgot-link'
                      onClick={() => this.changeResetMode()}
                    >
                      {t('forgot_pass')}
                    </p>
                  </>
                ) : (
                  <p className='forgot-instructions'>
                    {t('forgot_instructions')}
                  </p>
                )}
              </div>
            </div>
            <input
              type='submit'
              value={
                didForgotPass ? t('form_login_reset') : t('form_login_submit')
              }
            />
          </form>
        </div>
      </div>
    );
  }
}

Login.propTypes = {
  t: PropTypes.func.isRequired,
};

export default withTranslation()(Login);
