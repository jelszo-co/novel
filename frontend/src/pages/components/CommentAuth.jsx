import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import cookie from 'react-cookies';
import i18next from 'i18next';
import axios from 'axios';

import { ReactComponent as Google } from '../../assets/google.svg';
import { ReactComponent as FB } from '../../assets/facebook.svg';
import { ReactComponent as Mail } from '../../assets/mail.svg';
import { useTranslation } from 'react-i18next';

import { auth, GProvider, FProvider } from '../../firebase';

import { setPopup } from '../../actions/popup';

import '../../css/components/commentAuth.scss';

const CommentAuth = ({
  lineDir = 'left',
  style,
  handleDeauthComment,
  setPopup,
  callBack = () => {},
}) => {
  const { t } = useTranslation();

  const handleFB = async () => {
    try {
      auth().languageCode = i18next.t(['locale_name', 'en']);
      const res = await auth().signInWithPopup(FProvider);
      await axios.put(`${process.env.REACT_APP_SRV_ADDR}/user/`, {
        name: res.user.displayName,
      });
      callBack();
    } catch (err) {
      console.error(err);
      setPopup(t('err_login'), 'err');
    }
  };

  const handleGoogle = async () => {
    try {
      auth().languageCode = i18next.t(['locale_name', 'en']);
      const res = await auth().signInWithPopup(GProvider);
      await axios.put(`${process.env.REACT_APP_SRV_ADDR}/user/`, {
        name: res.user.displayName,
      });
      callBack();
    } catch (err) {
      console.error(err);
      setPopup(t('err_login'), 'err');
    }
  };

  return (
    <div style={style} className={`comment-auth-wrapper comment-auth-wrapper-${lineDir}`}>
      <span className='comment-auth-line' />
      <div className='comment-auth'>
        <button type='button' onClick={() => handleGoogle()}>
          <Google />
        </button>
        <button type='button' onClick={() => handleFB()}>
          <FB />
        </button>
        <Link to='/login'>
          <Mail />
        </Link>
        <p>{t('or')}</p>
        <button
          type='button'
          className='anonymously'
          onClick={async () => {
            const user = await auth()
              .signInAnonymously()
              .catch(err => console.error(err));
            const token = await user.user.getIdToken();
            cookie.save('usertoken', token, { path: '/', sameSite: 'lax' });
            handleDeauthComment();
          }}
        >
          {t('anonymously')}
        </button>
      </div>
    </div>
  );
};

const mapStateToProps = state => ({
  role: state.user.role,
});

export default connect(mapStateToProps, { setPopup })(CommentAuth);
