import React from 'react';

import '../css/all/errBoundary.scss';

import i18n from 'i18next';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div id='err-bound'>
          <h1>{i18n.t('react_err')}</h1>
          <p>{i18n.t('react_err_tip')}</p>
        </div>
      );
    }
    return this.props.children;
  }
}
