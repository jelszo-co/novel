import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import axios from 'axios';
import Moment from 'react-moment';

import CommentAuth from './CommentAuth';

import { ReactComponent as Reply } from '../../assets/reply.svg';
import { ReactComponent as HeartFilled } from '../../assets/heart.svg';
import { ReactComponent as HeartEmpty } from '../../assets/heart_empty.svg';
import { ReactComponent as Send } from '../../assets/paperplane.svg';
import { ReactComponent as Cross } from '../../assets/cross.svg';
import { ReactComponent as SimpleCross } from '../../assets/cross-outline.svg';
import { ReactComponent as Ban } from '../../assets/ban.svg';

import { setComments } from '../../actions/novels';
import { setPopup } from '../../actions/popup';

import '../../css/components/comment.scss';

const Comment = ({
  isReply = false,
  comment: { id, sender, writtenAt, likes, likedByMe, recipient, content, replies },
  user: { role, fUser },
  setComments,
  setPopup,
  cascadedReplyBar,
  cascadedReplyState,
  cascadedSetReplyState,
  cascadedReplyInput,
}) => {
  const { t } = useTranslation();
  let replyBar = useRef();
  const commentWrapper = useRef(null);
  let replyInput = useRef();
  const [height, setHeight] = useState('');
  let [replyState, setReplyState] = useState(true);
  const [replyPopup, setReplyPopup] = useState(false);
  const [modif, setModif] = useState('');
  const limit = 300;
  const [char, setChar] = useState(limit);
  const [reply, setReply] = useState('');

  const isMobile = window.innerWidth <= 800;

  if (isReply) {
    replyBar = cascadedReplyBar;
    replyState = cascadedReplyState;
    setReplyState = cascadedSetReplyState;
    replyInput = cascadedReplyInput;
  }

  useEffect(() => {
    const style = window.getComputedStyle(commentWrapper.current);
    setHeight(style.height);
  }, []);

  useEffect(() => {
    replyInput.current.focus();
  }, [replyState]);

  const handleReply = async () => {
    if (reply.length > 0) {
      if (role === 'stranger') {
        setReplyPopup(!replyPopup);
        if (isMobile) alert('A válaszhoz előbb be kell jelentkezned.');
      } else {
        try {
          const res = await axios.post(`${process.env.REACT_APP_SRV_ADDR}/comment/id/${id}/reply`, {
            content: reply,
            recipient: sender.id,
          });
          setComments(res.data);
          setReply('');
          setReplyState(false);
          setReplyPopup(false);
        } catch (err) {
          console.error(err);
          setPopup(t('err_send'), 'err');
        }
      }
    }
  };

  const handleDeauthReply = async () => {
    try {
      const res = await axios.post(`${process.env.REACT_APP_SRV_ADDR}/comment/id/${id}/reply`, {
        content: reply,
        recipient: sender.id,
      });
      setComments(res.data);
      setReply('');
    } catch (err) {
      console.error(err);
      setPopup(t('err_send_comment'), 'err');
    }
    return setReplyPopup(false);
  };

  const handleLike = async () => {
    if (fUser === null) return setPopup(t('err_login_fav'), 'err');
    try {
      const res = await axios.post(`${process.env.REACT_APP_SRV_ADDR}/comment/id/${id}/like`);
      setComments(res.data);
    } catch (err) {
      console.error(err);
      setPopup(t('err_like_comment'), 'err');
    }
    return null;
  };

  const commentSender = sender;
  const commentId = id;
  const fader = document.querySelectorAll(`.fader-${commentId}`);

  const deleteComment = async (cId = id) => {
    try {
      const res = await axios.delete(`${process.env.REACT_APP_SRV_ADDR}/comment/id/${cId}/`);
      setComments(res.data);
      if (role === 'admin') {
        fader.forEach(el => (el.style.opacity = 0));
        setTimeout(() => {
          if (modif === 'banned') {
            setModif('success');
          } else {
            setModif('deleted');
          }
          fader.forEach(el => (el.style.opacity = 1));
        }, 200);
      }
    } catch (err) {
      console.error(err);
      setPopup(t('err_del_comment'), 'err');
    }
  };

  const deleteAllComments = async uId => {
    try {
      const res = await axios.delete(
        `${process.env.REACT_APP_SRV_ADDR}/comment/user/${uId}/deleteAll/`,
      );
      setComments(res.data);
      fader.forEach(el => (el.style.opacity = 0));
      setTimeout(() => {
        setModif('success');
        fader.forEach(el => (el.style.opacity = 0));
      }, 200);
    } catch (err) {
      console.error(err);
      setPopup(t('err_del_comments'), 'err');
    }
  };

  const banUser = async (uId = sender.id) => {
    try {
      await axios.post(`${process.env.REACT_APP_SRV_ADDR}/comment/user/${uId}/ban/`);
      fader.forEach(el => (el.style.opacity = 0));
      setTimeout(() => {
        if (modif === 'deleted') {
          setModif('success');
        } else {
          setModif('banned');
        }
        fader.forEach(el => (el.style.opacity = 1));
      }, 200);
    } catch (err) {
      console.error(err);
      setPopup(t('err_block_user'), 'err');
    }
  };

  const CloseButton = () => (
    <button
      type='button'
      className='comment-close'
      onClick={() => {
        fader.forEach(el => (el.style.opacity = 0));
        setTimeout(() => {
          if (modif === 'banned') {
            setModif('');
          } else {
            setModif('null');
          }
          fader.forEach(el => (el.style.opacity = 1));
        }, 200);
      }}
    >
      <SimpleCross />
    </button>
  );

  let senderDisplay;
  if (sender.isYou) {
    senderDisplay = <span className='sender-you'>{t('you')}</span>;
  } else if (sender.isAdmin) {
    senderDisplay = (
      <span className='sender-admin'>
        Nóri <span>{t('author')}</span>
      </span>
    );
  } else senderDisplay = <span>{sender.name}</span>;
  switch (modif) {
    case 'deleted':
      return (
        <div className={`fader fader-${commentId} deleted`} style={{ height }}>
          <div className='text'>
            <p>
              <span>{commentSender.name}</span> {t('comment_deleted')}.
            </p>
            <button type='button' onClick={() => banUser(sender.id)}>
              {sender.name} {t('to_ban')}
            </button>
          </div>
          <CloseButton />
        </div>
      );
    case 'banned':
      return (
        <div className={`fader fader-${commentId} banned`} style={{ height }}>
          <div className='text'>
            <p>
              <span>{commentSender.name}</span> {t('banned')}.
            </p>
            <button type='button' onClick={() => deleteComment(commentId)}>
              {t('delete_this_comment')}
            </button>
            <button type='button' onClick={() => deleteAllComments(commentSender.id)}>
              {t('delete_all_comments')}
            </button>
          </div>
          <CloseButton />
        </div>
      );
    case 'success':
      return (
        <div className={`success fader fader-${commentId}`} style={{ height }}>
          <p>{t('success')}</p>
          <CloseButton />
        </div>
      );
    case 'null':
      return null;
    default:
      return (
        <div
          className={`comment fader fader-${commentId}${isReply ? ' comment-reply' : ''}`}
          ref={commentWrapper}
        >
          <div className='title-bar'>
            {isMobile ? (
              <p>
                {senderDisplay}
                <br />
                <Moment fromNow>{writtenAt}</Moment>
              </p>
            ) : (
              <p>
                {senderDisplay} | <Moment fromNow>{writtenAt}</Moment>
              </p>
            )}
            <div className='likes'>
              {likedByMe ? (
                <button type='button' onClick={() => handleLike()}>
                  <HeartFilled />
                </button>
              ) : (
                <button type='button' onClick={() => handleLike()}>
                  <HeartEmpty />
                </button>
              )}
              <p className='likes'>{likes}</p>
              <button
                className='reply-btn'
                type='button'
                onClick={() => {
                  setReplyState(!replyState);
                  replyBar.current.style.pointerEvents = replyState ? 'all' : 'none';
                  replyBar.current.style.marginTop = replyState ? '10px' : '-1.6rem';
                  replyBar.current.style.opacity = replyState ? 1 : 0;
                  if (!replyState) {
                    setTimeout(() => {
                      setReply('');
                      setReplyPopup(false);
                    }, 200);
                  }
                }}
              >
                <Reply />
              </button>
            </div>
            {(role === 'admin' || sender.isYou) && (
              <button type='button' className='admin-btn' onClick={() => deleteComment()}>
                <Cross />
              </button>
            )}
            {role === 'admin' && (
              <button type='button' className='admin-btn' onClick={() => banUser()}>
                <Ban className='ban' />
              </button>
            )}
          </div>
          <p className='comment-content'>
            {recipient && <span>{recipient.name}</span>} {content}
          </p>
          {!isReply &&
            replies.map(reply => (
              <Comment
                key={reply.id}
                comment={reply}
                isReply
                user={{ role, fUser }}
                setPopup={setPopup}
                cascadedReplyBar={replyBar}
                cascadedReplyState={replyState}
                cascadedSetReplyState={setReplyState}
                cascadedReplyInput={replyInput}
              />
            ))}
          {!isReply && (
            <form
              className='reply-bar'
              ref={replyBar}
              onSubmit={e => {
                e.preventDefault();
                handleReply(e);
              }}
            >
              <input
                ref={replyInput}
                type='text'
                name='reply'
                placeholder={`${t('reply_placeholder')} ${sender.name}`}
                maxLength={limit}
                value={reply}
                onChange={({ target: { value } }) => {
                  setChar(limit - value.length);
                  setReply(value);
                }}
              />
              <p className='char-limit'>
                {char}/{limit}
              </p>
              <button type='submit'>
                <Send />
              </button>
              <CommentAuth
                lineDir='left'
                handleDeauthComment={handleDeauthReply}
                style={{
                  opacity: replyPopup ? 1 : 0,
                  pointerEvents: replyPopup ? 'all' : 'none',
                }}
                callback={async () => {
                  setReplyPopup(false);
                  const res = await axios.post(
                    `${process.env.REACT_APP_SRV_ADDR}/comment/id/${id}/reply`,
                    { content: reply, recipient: sender.id },
                  );
                  setComments(res.data);
                }}
              />
            </form>
          )}
        </div>
      );
  }
};

Comment.defaultProps = {
  isReply: false,
  cascadedReplyBar: null,
  cascadedReplyState: null,
  cascadedSetReplyState: null,
  cascadedReplyInput: null,
};

Comment.propTypes = {
  isReply: PropTypes.bool,
  comment: PropTypes.shape({
    id: PropTypes.number.isRequired,
    sender: PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      isYou: PropTypes.bool.isRequired,
      isAdmin: PropTypes.bool.isRequired,
    }).isRequired,
    writtenAt: PropTypes.string.isRequired,
    likes: PropTypes.number.isRequired,
    likedByMe: PropTypes.bool.isRequired,
    recipient: PropTypes.shape({
      name: PropTypes.string.isRequired,
    }),
    content: PropTypes.string.isRequired,
    replies: PropTypes.arrayOf(PropTypes.object),
  }).isRequired,
  cascadedReplyBar: PropTypes.any,
  cascadedReplyState: PropTypes.any,
  cascadedSetReplyState: PropTypes.any,
  cascadedReplyInput: PropTypes.any,
  setComments: PropTypes.func,
  setPopup: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  user: state.user,
});

export default connect(mapStateToProps, { setComments, setPopup })(Comment);
