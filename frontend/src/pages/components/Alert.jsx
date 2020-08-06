import React from 'react';
import { connect } from 'react-redux';
import isEmpty from 'lodash/isEmpty';
import i18n from 'i18next';

import { delAlert } from '../../actions/alert';

import { ReactComponent as Cross } from '../../assets/cross-outline.svg';

import '../../css/components/alert.scss';

const Alert = ({ alert, delAlert }) => {
  if (isEmpty(alert)) return null;
  const { titleString, txtString } = alert;
  return (
    <div id='alert'>
      <div className='content'>
        <h2>{i18n.t(titleString)}</h2>
        <p>{i18n.t(txtString)}</p>
        <Cross onClick={() => delAlert()} />
      </div>
    </div>
  );
};

const mapStateToProps = state => ({
  alert: state.alert,
});

export default connect(mapStateToProps, { delAlert })(Alert);
