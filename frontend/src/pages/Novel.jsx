import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import { Link, Redirect, withRouter } from 'react-router-dom';
import Moment from 'react-moment';
import 'moment/locale/hu';

import { ReactComponent as StarFull } from '../assets/star_full.svg';
import { ReactComponent as StarEmpty } from '../assets/star_empty.svg';
import { ReactComponent as Send } from '../assets/paperplane.svg';
import { ReactComponent as Pencil } from '../assets/pencil.svg';
import { ReactComponent as Trash } from '../assets/trash.svg';

import '../css/all/novel.scss';
import { useTranslation } from 'react-i18next';
import { setPopup } from '../actions/popup';

const Novel = ({ match, user: { role }, history, setPopup }) => {
  const { t } = useTranslation();
  const [favPopup, setFavPopup] = useState(false);
  const [delPopup, setDelPopup] = useState(false);
  const [novel, setNovel] = useState({});
  //const [comments, setComments] = useState({});
  const [redirect, changeRedirect] = useState(false);
  const limit = 300;
  const [char, setChar] = useState(300);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_SRV_ADDR}/novel/${match.params.title}`)
      .then(res => {
        setNovel(res.data);
      })
      .catch(err => {
        if (err.response.status === 404) {
          changeRedirect(true);
        }
      });
    // axios
    //   .get(`${process.env.REACT_APP_SRV_ADDR}/comment/${match.params.title}`)
    //   .then(res => {
    //     setComments(res.data);
    //   })
    //   .catch(err => console.error(err.response));
  }, [match]);

  let { title, content, uploadedAt, favorite } = novel;

  const handleComment = e => {
    e.preventDefault();
  };

  const handleFavorite = async () => {
    if (role !== ('user' || 'admin')) {
      setFavPopup(!favPopup);
    } else {
      try {
        const res = await axios.post(
          `${process.env.REACT_APP_SRV_ADDR}/novel/${match.params.title}/favorite`,
        );
        setNovel({ ...novel, favorite: res.data.favorite });
      } catch (err) {
        console.error(err);
        setPopup('Hiba!', 'err');
      }
    }
  };

  const handleDelete = async () => {
    if (document.querySelector('.admin-delete-confirm').style.opacity === '1') {
      try {
        await axios.delete(
          `${process.env.REACT_APP_SRV_ADDR}/novel/${match.params.title}/`,
        );
        setPopup('Törölve.');
        history.push('/list');
      } catch (err) {
        setPopup('Hiba a novella törlése közben.', 'err');
        console.error(err);
      }
    }
  };

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
            {role === 'admin' ? (
              <>
                <div className='admin-actions'>
                  <button onClick={() => setEditMode(!editMode)}>
                    <Pencil />
                  </button>
                  <button onClick={() => setDelPopup(!delPopup)}>
                    <Trash />
                  </button>
                </div>
                <div
                  className='admin-delete-confirm'
                  style={{ opacity: delPopup ? 1 : 0 }}
                >
                  <span />
                  {t('del_popup')}
                  <button onClick={() => setDelPopup(false)}>
                    {t('cancel')}
                  </button>
                  <button className='delete' onClick={() => handleDelete()}>
                    {t('delete')}
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className='favorite' onClick={() => handleFavorite()}>
                  {favorite ? <StarFull /> : <StarEmpty />}
                </div>
                <div
                  className='fav-popup'
                  style={{ opacity: favPopup ? 1 : 0 }}
                >
                  <span />
                  {t('fav_popup')}
                  <Link to='/login'>{t('form_login_title')}</Link>
                </div>
              </>
            )}
          </h2>
          <Moment
            format='YYYY. MMMM DD.'
            locale={t('locale_name')}
            className='novel-date'
          >
            {uploadedAt}
          </Moment>
        </div>
        <div className='novel-content'>
          {content.split('\r\n').map((item, i) => (
            <p key={i}>{item}</p>
          ))}
        </div>
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

const mapStateToProps = state => ({
  user: state.user,
});

export default connect(mapStateToProps, { setPopup })(withRouter(Novel));
