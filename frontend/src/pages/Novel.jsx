import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Redirect } from 'react-router-dom';
import Moment from 'react-moment';
import moment from 'moment';
import 'moment/locale/hu';

import Menu from './components/Menu';

import { ReactComponent as StarFull } from '../assets/star_full.svg';
import { ReactComponent as StarEmpty } from '../assets/star_empty.svg';

import '../css/all/novel.scss';
import { useTranslation } from 'react-i18next';

const Novel = ({ match }) => {
  const { t } = useTranslation();
  const [novel, setNovel] = useState({});
  const [redirect, changeRedirect] = useState(false);

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

  const { title, content, uploadedAt, favorite } = novel;
  return (
    Object.keys(novel).length > 0 &&
    (redirect ? (
      <Redirect to='/404' />
    ) : (
      <div id='novel'>
        <Menu />
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
      </div>
    ))
  );
};

export default Novel;
