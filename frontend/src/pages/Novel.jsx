import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Redirect } from 'react-router-dom';
import Moment from 'react-moment';
import 'moment/locale/hu';

import { Link } from 'react-router-dom';

import { ReactComponent as StarFull } from '../assets/star_full.svg';
import { ReactComponent as StarEmpty } from '../assets/star_empty.svg';
import { ReactComponent as Send } from '../assets/paperplane.svg';

import '../css/all/novel.scss';
import { useTranslation } from 'react-i18next';

const Novel = ({ match }) => {
  const { t } = useTranslation();
  const [novel, setNovel] = useState({});
  const [redirect, changeRedirect] = useState(false);
  const limit = 300;
  const [char, setChar] = useState(300);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_SRV_ADDR}/novel/${match.params.title}`)
      .then(res => {
        console.log(res);
        setNovel(res.data);
      })
      .catch(err => {
        if (err.response.status === 404) {
          changeRedirect(true);
        }
      });
  }, [match]);

  const handleComment = e => {
    e.preventDefault();
  };

  const { title, content, uploadedAt, favorite } = novel;
  return (
    Object.keys(novel).length > 0 &&
    (redirect ? (
      <Redirect to='/404' />
    ) : (
      <div id='novel'>
        <Link to='/list' className='novel-back'>
          {t('back')}
        </Link>
        <div className='novel-header'>
          <h2 className='novel-title'>
            {title}
            {favorite ? <StarFull /> : <StarEmpty />}
          </h2>
          <Moment
            format='YYYY. MMMM DD.'
            locale={t('locale_name')}
            className='novel-date'
          >
            {uploadedAt}
          </Moment>
        </div>
        <div className='novel-content'>{content}</div>
        <h2 className='comments-header'>{t('comments_header')}</h2>
        <div className='comments'>
          <form className='write' onSubmit={e => handleComment(e)}>
            <input
              type='text'
              name='comment'
              placeholder={t('comment_placeholder')}
              maxLength={limit}
              onChange={e => setChar(limit - e.target.value.length)}
            />
            <p className='char-limit'>
              {char}/{limit}
            </p>
            <button type='submit'>
              <Send />
            </button>
          </form>
        </div>
      </div>
    ))
  );
};

export default Novel;
