import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, Redirect, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import TextareaAutoSize from 'react-textarea-autosize';
import axios from 'axios';
import Moment from 'react-moment';
import 'moment/locale/hu';

import { ReactComponent as StarFull } from '../assets/star_full.svg';
import { ReactComponent as StarEmpty } from '../assets/star_empty.svg';
import { ReactComponent as Send } from '../assets/paperplane.svg';
import { ReactComponent as Pencil } from '../assets/pencil.svg';
import { ReactComponent as Trash } from '../assets/trash.svg';
import { ReactComponent as Reply } from '../assets/reply.svg';
import { ReactComponent as HeartFilled } from '../assets/heart.svg';
import { ReactComponent as HeartEmpty } from '../assets/heart_empty.svg';

import { setPopup } from '../actions/popup';
import { getNovel, setNovel, setComments, clearNovel } from '../actions/novels';

import '../css/all/novel.scss';
import CommentAuth from './components/CommentAuth';

const Novel = ({
  match,
  user: { role },
  loading,
  novel,
  novel: { title, favorite, uploadedAt, content, error },
  comments,
  history,
  setPopup,
  getNovel,
  setNovel,
  setComments,
  clearNovel,
}) => {
  const { t } = useTranslation();
  const [favPopup, setFavPopup] = useState(false);
  const [delPopup, setDelPopup] = useState(false);
  const limit = 300;
  const [char, setChar] = useState(300);
  const [comment, setComment] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({});
  const [mainCommentPopup, setMainCommentPopup] = useState(false);

  useEffect(() => {
    getNovel(match.params.title, res => {
      setEditData({
        title: res.title,
        content: res.content
          .split('\r\n')
          .map((item, i) =>
            res.content.split('\r\n').length === i + 1
              ? item
              : `${item}\r\n\r\n`,
          ),
      });
    });
    return () => clearNovel();
  }, [match, getNovel, clearNovel]);

  const handleComment = async () => {
    if (comment.length > 0) {
      if (role === 'stranger') {
        setMainCommentPopup(!mainCommentPopup);
      } else {
        try {
          const res = await axios.post(
            `${process.env.REACT_APP_SRV_ADDR}/comment/path/${match.params.title}`,
            { comment: comment },
          );
          setComments(res.data);
        } catch (err) {
          console.error(err);
          setPopup('Hiba a komment elküldése közben.', 'err');
        }
      }
    }
  };

  const handleDeauthComment = async () => {
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_SRV_ADDR}/comment/path/${match.params.title}`,
        { comment: comment },
      );
      setComments(res.data);
    } catch (err) {
      console.error(err);
      setPopup('Hiba a komment elküldése közben.', 'err');
    }
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

  const handleSave = async () => {
    try {
      const res = await axios.put(
        `${process.env.REACT_APP_SRV_ADDR}/novel/${match.params.title}`,
        {
          title: editData.title,
          content: editData.content.join('').replace('\r\n\r\n', '\r\n'),
        },
      );
      setNovel(res.data);
      setEditData({
        title: res.data.title,
        content: res.data.content
          .split('\r\n')
          .map((item, i) =>
            res.data.content.split('\r\n').length === i + 1
              ? item
              : `${item}\r\n\r\n`,
          ),
      });
      setEditMode(false);
      setPopup('Sikeres mentés!');
    } catch (err) {
      console.error(err);
      setPopup('Hiba a novella mentése közben.', 'err');
    }
  };

  const handleDiscard = () => {
    setEditData({
      title: novel.title,
      content: novel.content
        .split('\r\n')
        .map((item, i) =>
          novel.content.split('\r\n').length === i + 1
            ? item
            : `${item}\r\n\r\n`,
        ),
    });
    setEditMode(false);
  };

  return (
    !loading &&
    (error ? (
      <Redirect to='/404' />
    ) : (
      <div id='novel'>
        <Link to='/list' className='novel-back'>
          {t('back')}
        </Link>
        <div className='novel-header'>
          <h2 className='novel-title'>
            {editMode ? (
              <input
                type='text'
                value={editData.title}
                onChange={({ target: { value } }) =>
                  setEditData({ ...editData, title: value })
                }
              />
            ) : (
              title
            )}
            {role === 'admin' ? (
              <>
                <div className='admin-actions'>
                  {!editMode && (
                    <button
                      type='button'
                      onClick={() => setEditMode(!editMode)}
                    >
                      <Pencil />
                    </button>
                  )}
                  <button type='button' onClick={() => setDelPopup(!delPopup)}>
                    <Trash />
                  </button>
                </div>
                <div
                  className='admin-delete-confirm'
                  style={{ opacity: delPopup ? 1 : 0 }}
                >
                  <span />
                  {t('del_popup')}
                  <button type='button' onClick={() => setDelPopup(false)}>
                    {t('cancel')}
                  </button>
                  <button
                    type='button'
                    className='delete'
                    onClick={() => handleDelete()}
                  >
                    {t('delete')}
                  </button>
                </div>
              </>
            ) : (
              <>
                <div
                  className='favorite'
                  onClick={() => handleFavorite()}
                  onKeyDown={() => handleFavorite()}
                  role='button'
                >
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
          {editMode ? (
            <>
              <p className='edit-actions'>
                <button type='button' onClick={() => handleSave()}>
                  {t('save')}
                </button>
                {t('or')}
                <button type='button' onClick={() => handleDiscard()}>
                  {t('discard')}
                </button>
              </p>
              <TextareaAutoSize
                spellCheck={false}
                value={editData.content.join('')}
                onChange={({ target: { value } }) =>
                  setEditData({
                    ...editData,
                    content: value
                      .split('\r\n')
                      .map((item, i) =>
                        value.split('\r\n').length === i + 1
                          ? item
                          : `${item}\r\n\r\n`,
                      ),
                  })
                }
              />
              <p className='edit-actions'>
                <button type='button' onClick={() => handleSave()}>
                  {t('save')}
                </button>
                {t('or')}
                <button type='button' onClick={() => handleDiscard()}>
                  {t('discard')}
                </button>
              </p>
            </>
          ) : (
            content.split('\r\n').map((item, i) => <p key={i}>{item}</p>)
          )}
        </div>

        <h2 className='comments-header'>{t('comments_header')}</h2>
        <div className='comments'>
          <form
            className='write'
            onSubmit={e => {
              e.preventDefault();
              handleComment(e);
            }}
          >
            <input
              type='text'
              name='comment'
              placeholder={t('comment_placeholder')}
              maxLength={limit}
              value={comment}
              onChange={({ target: { value } }) => {
                setChar(limit - value.length);
                setComment(value);
              }}
            />
            <p className='char-limit'>
              {char}/{limit}
            </p>
            <button type='submit'>
              <Send />
            </button>
            <CommentAuth
              lineDir='bottom'
              handleDeauthComment={handleDeauthComment}
              style={{
                opacity: mainCommentPopup ? 1 : 0,
                pointerEvents: mainCommentPopup ? 'all' : 'none',
              }}
            />
          </form>
          {comments.map(comment => (
            <Comment key={comment.id} comment={comment} />
          ))}
        </div>
      </div>
    ))
  );
};

const Comment = ({
  isReply = false,
  comment: { sender, writtenAt, likes, likedByMe, recipient, content, replies },
}) => (
  <div className={`comment ${isReply && 'comment-reply'}`}>
    <div className='title-bar'>
      <p>
        <span>{sender.name}</span> | <Moment fromNow>{writtenAt}</Moment>
      </p>
      <div className='likes'>
        {likedByMe ? (
          <button type='button'>
            <HeartFilled />
          </button>
        ) : (
          <button type='button'>
            <HeartEmpty />
          </button>
        )}
        <p className='likes'>{likes}</p>
      </div>
      <button type='button'>
        <Reply />
      </button>
    </div>
    <p>
      {recipient && recipient.name} {content}
    </p>
    {!isReply &&
      replies.map(reply => (
        <Comment key={reply.id} comment={reply} isReply={true} />
      ))}
  </div>
);

const mapStateToProps = state => ({
  user: state.user,
  novel: state.novels.novel,
  comments: state.novels.comments,
  loading: state.novels.novelLoading,
});

export default connect(mapStateToProps, {
  setPopup,
  getNovel,
  setNovel,
  setComments,
  clearNovel,
})(withRouter(Novel));
