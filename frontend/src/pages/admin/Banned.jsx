import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

import { setPopup } from '../../actions/popup';

import Title from '../components/Title';

import { ReactComponent as Cross } from '../../assets/cross-filled.svg';

import '../../css/admin/banned.scss';

const Banned = ({ setPopup, history }) => {
  const { t } = useTranslation();
  const [banned, setBanned] = useState([
    { name: 'Unknown', id: 5 },
    { name: 'Jelszo Co.', id: 2 },
  ]);
  useEffect(() => {
    axios
      .get(process.env.REACT_APP_SRV_ADDR + '/banned')
      .then(res => setBanned(res.data))
      .catch(err => {
        console.error(err);
        setPopup(t('err_admin_block_users'), 'err');
      });
  }, [setPopup, t]);
  return (
    <>
      <button onClick={() => history.goBack()} className='banned-back'>
        {t('back')}
      </button>
      <Title>{t('admin_banned_title')}</Title>
      <div id='banned'>
        {banned.length > 0
          ? banned.map(({ name, id }) => (
              <p key={id}>
                {name}
                <button
                  onClick={() => {
                    axios
                      .post(
                        process.env.REACT_APP_SRV_ADDR +
                          '/comment/user/' +
                          id +
                          '/unban/',
                      )
                      .then(res => setBanned(res.data))
                      .catch(err => {
                        console.error(err);
                        setPopup(t('err_admin_unblock_user'), 'err');
                      });
                  }}
                >
                  <Cross />
                </button>
              </p>
            ))
          : ''}
      </div>
    </>
  );
};

export default connect(null, { setPopup })(withRouter(Banned));
