import React, { useState } from 'react';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import isEmpty from 'lodash/isEmpty';
import i18n from 'i18next';

import { delAlert } from '../../actions/alert';

import { ReactComponent as Cross } from '../../assets/cross-outline.svg';

import '../../css/components/alert.scss';

const Alert = ({ alert, delAlert }) => {
  const { t } = useTranslation();
  const [inp, setInp] = useState('');
  if (isEmpty(alert)) return null;
  const { titleString, txtString, isPassword, callback } = alert;
  return (
    <div id='alert'>
      <div className='content'>
        <h2>{i18n.t(titleString)}</h2>
        <p>{i18n.t(txtString)}</p>
        <Cross
          onClick={() => {
            delAlert();
            if (!isPassword) {
              callback();
            }
          }}
        />
        {isPassword ? (
          <form
            onSubmit={e => {
              e.preventDefault();
              callback(inp);
            }}
          >
            <input
              placeholder={t('form_password')}
              type='password'
              autoComplete='current-password'
              value={inp}
              onChange={e => setInp(e.target.value)}
            />
            <br />
            <button type='submit'>ok</button>
          </form>
        ) : (
          ''
        )}
      </div>
    </div>
  );
};

const mapStateToProps = state => ({
  alert: state.alert,
});

export default connect(mapStateToProps, { delAlert })(Alert);
