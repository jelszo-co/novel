import React, { useState, useRef } from 'react';
import { Redirect, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';

import { auth } from '../../firebase';
import { setPopup } from '../../actions/popup';

import Title from '../components/Title';
import Menu from '../components/Menu';

import { ReactComponent as Word } from '../../assets/word.svg';

import '../../css/admin/admin.scss';

const Admin = ({ user: { role }, setPopup }) => {
  const { t } = useTranslation();
  return role === 'admin' ? (
    <div id='admin'>
      <Menu />
      <Title>Admin panel</Title>
      <div className='panel panel-left'>
        <p className='panel-title'>{t('admin_comments_title')}</p>
        <Link to='/list' className='panel-link'>
          {t('admin_comments_link')}
        </Link>
      </div>
      <div className='upload'>
        <p className='panel-title'>{t('admin_upload_title')}</p>
        <Uploader setPopup={setPopup} />
      </div>
      <div className='panel panel-right'>
        <p className='panel-title'>{t('admin_banned_title')}</p>
        <Link to='/admin/banned' className='panel-link'>
          {t('admin_banned_link')}
        </Link>
      </div>
      <div className='account-management'>
        <button>{t('admin_account_email')}</button>
        <button>{t('admin_account_pass')}</button>
        <button onClick={() => auth().signOut()}>{t('profile_logout')}</button>
      </div>
    </div>
  ) : (
    <Redirect to='/login' />
  );
};

const Uploader = ({ setPopup }) => {
  const { t } = useTranslation();
  const [phase, setPhase] = useState(0);
  const [novelData, setNovelData] = useState({ title: '', lore: '' });
  const { title, lore } = novelData;
  const container = useRef(null);

  const increment = () => {
    console.log('incrementing ' + phase + ' by 1');

    container.current.style.opacity = 0;
    setTimeout(() => {
      setPhase(phase + 1);
      container.current.style.opacity = 1;
    }, 200);
  };

  const onDrop = async files => {
    try {
      if (files.length > 1)
        return setPopup('Egyszerre csak egy novellát tölts fel.', 'err');
      increment();
      const data = new FormData();
      data.append('noveldoc', files[0]);
      try {
        await axios.post(`${process.env.REACT_APP_SRV_ADDR}/novel/new`, data);
      } catch (err) {}
      increment();
    } catch (err) {
      console.error(err);
      setPopup('Hiba a novella feltöltése közben.', 'err');
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
          {isDragActive ? <p>Drop files here</p> : <p>click to select</p>}
        </div>
      );
      break;
    case 2:
      component = <p>Feltöltés...</p>;
      break;
    case 3:
      component = (
        <div className='novel-params'>
          <p className='params-title'>{t('title')}</p>
          <input
            type='text'
            value={title}
            onChange={({ target }) =>
              setNovelData({ ...novelData, title: target.value })
            }
          />
          <div className='icon'>
            <Word />
          </div>
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

const mapStateToProps = state => ({
  user: state.user,
});

export default connect(mapStateToProps, { setPopup })(Admin);
