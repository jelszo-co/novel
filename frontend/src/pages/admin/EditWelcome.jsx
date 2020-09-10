import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { withRouter, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { setPopup } from '../../actions/popup';

import Title from '../components/Title';

import '../../css/admin/editWelcome.scss';

const EditWelcome = ({ user, history, setPopup }) => {
  const { t } = useTranslation();

  const [text, setText] = useState('');
  const [lang, setLang] = useState('HU');

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_SRV_ADDR}/introduction/?lang=${lang}`)
      .then(res => setText(res.data.introduction));
  }, [lang]);

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await axios.post(`${process.env.REACT_APP_SRV_ADDR}/introduction/`, {
        introduction: text,
        lang,
      });
      setPopup(t('welcome_edit_success'));
      history.push('/admin');
    } catch (err) {
      console.error(err);
      setPopup(t('err_welcome_edit'), 'err');
    }
  };
  if (user.role !== 'admin') return <Redirect to='/login' />;
  return (
    <div id='welcome-edit'>
      <Title>{t('admin_welcome_edit')}</Title>
      <form onSubmit={e => handleSubmit(e)}>
        <button
          type='button'
          className={`w-lng${lang === 'HU' ? ' w-lng-active' : ''}`}
          onClick={() => setLang('HU')}
        >
          HU
        </button>
        <button
          type='button'
          className={`w-lng${lang === 'EN' ? ' w-lng-active' : ''}`}
          onClick={() => setLang('EN')}
        >
          EN
        </button>
        <textarea type='text' value={text} onChange={({ target }) => setText(target.value)} />
        <button type='button' onClick={() => history.goBack()} className='admin-edit-back'>
          {t('back')}
        </button>
        <button type='submit'>{t('save')}</button>
      </form>
    </div>
  );
};

EditWelcome.propTypes = {
  user: PropTypes.object.isRequired,
  setPopup: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  user: state.user,
});

export default connect(mapStateToProps, { setPopup })(withRouter(EditWelcome));
