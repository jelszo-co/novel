import React, { useState, useRef } from 'react';
import { Redirect, Link } from 'react-router-dom';
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

import '../../css/admin/admin.scss';

const Admin = ({ user: { role }, setPopup, getNovels }) => {
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
  const [novelData, setNovelData] = useState({
    title: 'Cím a novellából',
    lore: 'Ez egy leírás',
    path: 'cim-a-novellabol',
    filename: 'novella.docx', // TODO: Change back to empty
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
      setNovelData({ ...novelData, ...res });
      console.log({ ...novelData, ...res });
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
          {isDragActive ? <p>Drop files here</p> : <p>click to select</p>}
        </div>
      );
      break;
    case 2:
      component = <p>Feltöltés...</p>;
      break;
    case 3:
      component = (
        <form
          className='novel-params'
          onSubmit={e => {
            e.preventDefault();
            increment();
          }}
        >
          <p className='params-title'>{t('title')}:</p>
          <input
            type='text'
            value={title}
            placeholder={t('title_hint')}
            onChange={({ target }) =>
              setNovelData({ ...novelData, title: target.value })
            }
          />
          <div className='icon'>
            <Word />
            <p>{filename}</p>
          </div>
          <input type='submit' value={t('next')} />
        </form>
      );
      break;
    case 4:
      component = (
        <form
          className='novel-params'
          onSubmit={e => {
            e.preventDefault();
            axios.patch(process.env.REACT_APP_SRV_ADDR + '/novel/' + path, {
              ...novelData,
              private: false,
            });
          }}
        >
          <p className='params-lore'>{t('description')}:</p>
          <input
            type='text'
            value={lore}
            placeholder={t('title_hint')}
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
