import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import axios from 'axios';
import Moment from 'react-moment';

import CommentAuth from './CommentAuth';

import { ReactComponent as Reply } from '../../assets/reply.svg';
import { ReactComponent as HeartFilled } from '../../assets/heart.svg';
import { ReactComponent as HeartEmpty } from '../../assets/heart_empty.svg';
import { ReactComponent as Send } from '../../assets/paperplane.svg';

import { setComments } from '../../actions/novels';
import { setPopup } from '../../actions/popup';

import '../../css/components/comment.scss';

const Comment = ({
  isReply = false,
  comment: { sender, writtenAt, likes, likedByMe, recipient, content, replies },
  handleDeauthComment,
  match,
  role,
  setComments,
  setPopup,
  cascadedReplyBar,
  cascadedReplyState,
  cascadedSetReplyState,
}) => {
  const { t } = useTranslation();
  let replyBar = useRef();
  let [replyState, setReplyState] = useState(true);
  const [replyPopup, setReplyPopup] = useState(false);
  const limit = 300;
  const [char, setChar] = useState(300);
  const [reply, setReply] = useState('');

  if (isReply) {
    replyBar = cascadedReplyBar;
    replyState = cascadedReplyState;
    setReplyState = cascadedSetReplyState;
  }

  const handleReply = async () => {
    if (reply.length > 0) {
      if (role === 'stranger') {
        setReplyPopup(!replyPopup);
      } else {
        try {
          const res = await axios.post(
            `${process.env.REACT_APP_SRV_ADDR}/comment/path/${match.params.title}`,
            { content: reply },
          );
          setComments(res.data);
        } catch (err) {
          console.error(err);
          setPopup('Hiba a válasz elküldése közben.', 'err');
        }
      }
    }
  };
  return (
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
            <button type='button' onClick={() => {}}>
              <HeartEmpty />
            </button>
          )}
          <p className='likes'>{likes}</p>
        </div>
        <button
          type='button'
          onClick={() => {
            setReplyState(!replyState);
            replyBar.current.style.pointerEvents = replyState ? 'all' : 'none';
            replyBar.current.style.marginTop = replyState ? '10px' : '-1.6rem';
            replyBar.current.style.opacity = replyState ? 1 : 0;
            setTimeout(() => {
              if (!replyState) setReply('');
            }, 200);
          }}
        >
          <Reply />
        </button>
      </div>
      <p className='comment-content'>
        {recipient && recipient.name} {content}
      </p>
      {!isReply &&
        replies.map(reply => (
          <Comment
            key={reply.id}
            comment={reply}
            isReply
            cascadedReplyBar={replyBar}
            cascadedReplyState={replyState}
            cascadedSetReplyState={setReplyState}
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
            type='text'
            name='reply'
            placeholder={t('reply_placeholder')}
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
            handleDeauthComment={handleDeauthComment}
            style={{
              opacity: replyPopup ? 1 : 0,
              pointerEvents: replyPopup ? 'all' : 'none',
            }}
          />
        </form>
      )}
    </div>
  );
};

const mapStateToProps = state => ({
  role: state.user.role,
});

export default connect(mapStateToProps, { setComments, setPopup })(Comment);
