import React, { useState, useRef, useEffect } from 'react';
import { Redirect, Link } from 'react-router-dom';
import Moment from 'react-moment';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import PropTypes from 'prop-types';

import { auth } from '../../firebase';
import { setPopup } from '../../actions/popup';
import { getNovels } from '../../actions/novels';

import Title from '../components/Title';
import Menu from '../components/Menu';

import { ReactComponent as Word } from '../../assets/word.svg';
import { ReactComponent as Tick } from '../../assets/tick.svg';
import { ReactComponent as Reply } from '../../assets/reply.svg';
import ripple from '../../assets/ripple.gif';

import '../../css/admin/admin.scss';

const Admin = ({ user: { role }, setPopup, getNovels }) => {
  const [comments, setComments] = useState([
    {
      title: 'Utols\u00f3 percek',
      path: 'utolso-percek',
      comments: [
        {
          id: 1,
          content:
            'Elad\u00f3 Honda Jazz 1.6 turb\u00f3 sz\u00edv\u00f3 2010 64E km 3.6M k\u00f6szhelo',
          senderName: 'Unknown',
          writtenAt: '2020-06-12T18:50:27.456Z',
        },
        {
          id: 2,
          content: 'Benc\u00e9t Bannoln\u00e1m',
          senderName: 'Unknown',
          writtenAt: '2020-06-07T17:46:36.432Z',
        },
      ],
    },
  ]);
  const [banned, setBanned] = useState([]);
  useEffect(() => {
    axios
      .get(process.env.REACT_APP_SRV_ADDR + '/comment/recent')
      .then(res => setComments(res.data))
      .catch(err => {
        console.error(err);
        setPopup('Hiba a kommentek lekérdezése közben.', 'err');
      });
    axios
      .get(process.env.REACT_APP_SRV_ADDR + '/banned')
      .then(res => setBanned(res.data))
      .catch(err => {
        console.error(err);
        setPopup('Hiba a tiltott felhasználók lekérdezésében.', 'err');
      });
  }, [setPopup]);
  const { t } = useTranslation();
  if (role !== 'admin') return <Redirect to='/login' />;
  return (
    <div id='admin'>
      <Menu />
      <Title>Admin panel</Title>
      <div className='panel panel-left'>
        <p className='panel-title'>{t('admin_comments_title')}</p>
        <div className='comments'>
          {comments.map(novel => (
            <div key={novel.path} className='comment-wrapper'>
              <h3>
                {novel.title}
                <Link to={novel.path}>
                  <Reply />
                </Link>
              </h3>
              {novel.comments.map(cmt => (
                <div key={cmt.id} className='comment-body'>
                  <p className='comment-title'>
                    {cmt.senderName} | <Moment fromNow>{cmt.writtenAt}</Moment>
                  </p>
                  <p className='comment-content'>{cmt.content}</p>
                </div>
              ))}
            </div>
          ))}
        </div>
        <Link to='/list' className='panel-link'>
          {t('admin_comments_link')}
        </Link>
      </div>
      <div className='upload'>
        <p className='panel-title'>{t('admin_upload_title')}</p>
        <Uploader setPopup={setPopup} getNovels={getNovels} />
      </div>
      <div className='panel panel-right'>
        <p className='panel-title'>{t('admin_banned_title')}</p>
        <div className='banned-list'>
          {banned.map(usr => (
            <div></div> // TODO
          ))}
        </div>
        <Link to='/admin/banned' className='panel-link'>
          {t('admin_banned_link')}
        </Link>
      </div>
      <div className='account-management'>
        <Link to='/update-email'>{t('admin_account_email')}</Link>
        <Link to='/update-pass'>{t('admin_account_pass')}</Link>
        <button onClick={() => auth().signOut()}>{t('profile_logout')}</button>
      </div>
    </div>
  );
};

const Uploader = ({ setPopup, getNovels }) => {
  const { t } = useTranslation();
  const [phase, setPhase] = useState(0);
  const [novelData, setNovelData] = useState({
    title: '',
    lore: '',
    path: '',
    filename: '',
  });
  const { title, lore, filename, path } = novelData;
  const container = useRef(null);

  const phaseRef = useRef(phase);
  phaseRef.current = phase;

  const increment = () => {
    container.current.style.opacity = 0;
    setTimeout(() => {
      setPhase(phaseRef.current + 1);
      container.current.style.opacity = 1;
    }, 200);
  };

  const onDrop = async files => {
    try {
      if (files.length > 1)
        return setPopup('Egyszerre csak egy novellát tölts fel.', 'err');
      if (!/(.doc|.docx)/i.test(files[0].name))
        return setPopup(
          'A novellát .doc vagy .docx fájlként töltsd fel.',
          'err',
        );
      increment();
      const data = new FormData();
      data.append('noveldoc', files[0]);
      const res = await axios.post(
        `${process.env.REACT_APP_SRV_ADDR}/novel/new`,
        data,
      );
      setNovelData({ ...novelData, ...res.data });
      console.log({ ...novelData, ...res.data });
      increment();
    } catch (err) {
      console.error(err);
      setPopup('Hiba a novella feltöltése közben.', 'err');
      setPhase(0);
    }
  };
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  let component;
  switch (phase) {
    case 0:
      component = (
        <button type='button' onClick={() => increment()}>
          {t('upload_begin')}
        </button>
      );
      break;
    case 1:
      component = (
        <div {...getRootProps({ className: 'uploader-zone' })}>
          <input {...getInputProps()} />
          {isDragActive ? (
            <p>{t('upload_dropzone_active')}</p>
          ) : (
            <p>{t('upload_dropzone_hint')}</p>
          )}
        </div>
      );
      break;
    case 2:
      component = (
        <div className='upload-progress'>
          <img alt='' src={ripple} />
          <p>{t('upload_progress')}</p>
        </div>
      );
      break;
    case 3:
      component = (
        <form
          onSubmit={e => {
            e.preventDefault();
            increment();
          }}
        >
          <p className='params-title'>{t('title')}:</p>
          <input
            required
            type='text'
            value={title}
            placeholder={t('title_hint')}
            onChange={({ target }) =>
              setNovelData({ ...novelData, title: target.value })
            }
          />
          <div className='icon'>
            <Word />
            <p className='filename'>{filename}</p>
          </div>
          <input type='submit' value={t('next')} />
        </form>
      );
      break;
    case 4:
      component = (
        <form
          className='novel-params'
          onSubmit={async e => {
            e.preventDefault();
            await axios.patch(
              process.env.REACT_APP_SRV_ADDR + '/novel/' + path,
              {
                ...novelData,
                private: false,
              },
            );
            increment();
            getNovels();
          }}
        >
          <p className='params-title'>{t('description')}:</p>
          <textarea
            required
            rows='4'
            align='bottom'
            value={lore}
            placeholder={t('description_hint')}
            spellCheck='false'
            onChange={({ target }) =>
              setNovelData({ ...novelData, lore: target.value })
            }
          />
          <div className='icon'>
            <Word />
            <p>{filename}</p>
          </div>
          <input type='submit' value={t('publish')} />
        </form>
      );
      break;
    case 5:
      component = (
        <div className='novel-success'>
          <Tick />
          <p>{t('success')}</p>
        </div>
      );
      break;
    default:
      component = null;
  }

  return (
    <div className='uploader' ref={container}>
      {component}
    </div>
  );
};

Admin.propTypes = {
  user: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  user: state.user,
});

export default connect(mapStateToProps, { setPopup, getNovels })(Admin);
