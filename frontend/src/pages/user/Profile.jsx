import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Redirect, Link } from 'react-router-dom';
import Moment from 'react-moment';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

import Title from '../components/Title';
import Menu from '../components/Menu';

import { setPopup } from '../../actions/popup';
import { auth } from '../../firebase';

import { ReactComponent as Reply } from '../../assets/reply.svg';
import { ReactComponent as Cross } from '../../assets/cross.svg';

import '../../css/user/profile.scss';

const Profile = ({ user: { name, role, fUser }, setPopup }) => {
  const { t } = useTranslation();
  const [favs, setFavs] = useState([]);
  const [comments, setComments] = useState([
    {
      title: 'Konzol Zsolt \u00e9lete',
      path: 'konzol-zsolt-elete',
      comments: [
        {
          content: 'Egyes\u00e9vel.',
          senderName: 'Jelszo Reborn',
          writtenAt: '2020-06-21T13:26:08.997Z',
          id: 42,
          recipientName: null,
          isReply: false,
        },
        {
          content: 'Kommentek',
          senderName: 'Jelszo Reborn',
          writtenAt: '2020-06-21T13:26:05.960Z',
          id: 41,
          recipientName: null,
          isReply: false,
        },
        {
          content: 'Teszt',
          senderName: 'Jelszo Reborn',
          writtenAt: '2020-06-21T13:26:03.377Z',
          id: 40,
          recipientName: null,
          isReply: false,
        },
        {
          content: 'Mind',
          senderName: 'Jelszo Reborn',
          writtenAt: '2020-06-21T13:26:01.335Z',
          id: 39,
          recipientName: null,
          isReply: false,
        },
        {
          content: 'Ezek',
          senderName: 'Jelszo Reborn',
          writtenAt: '2020-06-21T13:25:58.337Z',
          id: 38,
          recipientName: null,
          isReply: false,
        },
      ],
    },
  ]);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_SRV_ADDR}/novel/favorites`)
      .then(res => setFavs(res.data))
      .catch(err => console.error(err));
    axios
      .get(`${process.env.REACT_APP_SRV_ADDR}/comment/recent`)
      .then(res => setComments(res.data))
      .catch(err => {
        console.error(err);
        setPopup(t('err_admin_load_comments'), 'err');
      });
  }, [setPopup, t]);

  const { email, emailVerified } = fUser;
  const sendEmail = async () => {
    try {
      await fUser.sendEmailVerification();
      setPopup(t('success_email_send'));
    } catch (err) {
      console.error(err);
      setPopup(t('err_email_send'), 'err');
    }
  };

  const handleDelete = async cId => {
    try {
      const res = await axios.delete(
        `${process.env.REACT_APP_SRV_ADDR}/comment/id/${cId}/`,
      );
      setComments(res.data);
    } catch (err) {
      setPopup(t('err_del_comment'), 'err');
    }
  };

  return role === 'user' ? (
    <div id='profile'>
      <Menu />
      <Title>{t('profile_title')}</Title>
      <div className='content-wrapper'>
        <div className='col-side'>
          <div className='col-item col-item-left border-left'>
            <p className='name'>{name}</p>
            <p className='email'>
              {email}{' '}
              {!emailVerified && (
                <button
                  type='button'
                  className='email-confirm'
                  onClick={() => sendEmail()}
                >
                  {t('profile_email_confirm')}
                </button>
              )}
            </p>
            <Link to='/update-email' className='change-upleft'>
              {t('profile_change_general')}
            </Link>
          </div>
          <div className='col-item col-item-left'>
            <div className='border-left'>
              <Link
                className='profile-action'
                style={{ marginBottom: '10px' }}
                to='/update-pass'
              >
                {t('profile_change_password')}
              </Link>
              <Link className='profile-action' to='/delete'>
                {t('profile_delete_account')}
              </Link>
            </div>
          </div>
        </div>
        <div className='col-center'>
          <h3 className='col-center-title'>{t('profile_last_comments')}</h3>
          <div className='recent-comments'>
            {comments.map(novel => (
              <div key={novel.path} className='comment-wrapper'>
                <h3>
                  {novel.title}
                  <Link to={`/novels/${novel.path}`}>
                    <Reply />
                  </Link>
                </h3>
                {novel.comments.map(cmt => (
                  <div key={cmt.id} className='comment-body'>
                    <p className='comment-title'>
                      <span>{t('you')}</span> |{' '}
                      <Moment fromNow>{cmt.writtenAt}</Moment>
                      <button
                        type='button'
                        className='admin-btn'
                        onClick={() => handleDelete(cmt.id)}
                      >
                        <Cross />
                      </button>
                    </p>
                    <p className='comment-content'>{cmt.content}</p>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
        <div className='col-side'>
          <div className='col-item col-item-right'>
            <p className='fav-title'>{t('profile_fav_novels')}</p>
            <div className='fav-novels'>
              {favs.length > 0 ? (
                favs.map(fav => <Link to={fav.path}>{fav.title}</Link>)
              ) : (
                <p className='no-fav'>{t('profile_no_fav')}</p>
              )}
            </div>
          </div>
          <div className='col-item col-item-right'>
            <button
              type='button'
              onClick={() => {
                auth().signOut();
                setPopup(t('success_logout'));
              }}
            >
              {t('profile_logout')}
            </button>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <Redirect to='/login' />
  );
};

Profile.propTypes = {
  setPopup: PropTypes.func.isRequired,
  user: PropTypes.shape({
    name: PropTypes.string,
    role: PropTypes.oneOf(['admin', 'user', 'anonymous', 'stranger'])
      .isRequired,
    fUser: PropTypes.shape({
      email: PropTypes.string,
      emailVerified: PropTypes.bool,
      sendEmailVerification: PropTypes.func,
    }),
  }).isRequired,
};

const mapStateToProps = state => ({
  user: state.user,
});

export default connect(mapStateToProps, { setPopup })(Profile);
