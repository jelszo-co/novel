import React from 'react';
import { connect } from 'react-redux';
import cookie from 'react-cookies';

import { ReactComponent as Google } from '../../assets/google.svg';
import { ReactComponent as FB } from '../../assets/facebook.svg';
import { ReactComponent as Mail } from '../../assets/mail.svg';
import { useTranslation } from 'react-i18next';

import { auth } from '../../firebase';

import '../../css/components/commentAuth.scss';

const CommentAuth = ({ lineDir = 'left', style, handleDeauthComment }) => {
  const { t } = useTranslation();
  return (
    <div
      style={style}
      className={`comment-auth-wrapper comment-auth-wrapper-${lineDir}`}
    >
      <span className='comment-auth-line'></span>
      <div className='comment-auth'>
        <Google />
        <FB />
        <Mail />
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

export default connect(mapStateToProps)(CommentAuth);
