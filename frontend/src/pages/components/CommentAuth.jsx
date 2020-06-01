import React from 'react';

import { ReactComponent as Google } from '../../assets/google.svg';
import { ReactComponent as FB } from '../../assets/facebook.svg';
import { ReactComponent as Mail } from '../../assets/mail.svg';
import { useTranslation } from 'react-i18next';

import '../../css/components/commentAuth.scss';

const CommentAuth = ({ lineDir = 'left' }) => {
  const { t } = useTranslation();
  return (
    <div className={`comment-auth-wrapper comment-auth-wrapper-${lineDir}`}>
      <span className={`comment-auth-line`}></span>
      <div className='comment-auth'>
        <Google />
        <FB />
        <Mail />
        <p>{t('or')}</p>
        <button type='button' className='anonymously'>
          {t('anonymously')}
        </button>
      </div>
    </div>
  );
};

export default CommentAuth;
