import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import moment from 'moment';

import '../../css/components/menu.scss';

const useOutsideAlerter = (ref, changeMenu) => {
  useEffect(() => {
    const handleClickOutside = event => {
      if (ref.current && !ref.current.contains(event.target)) {
        changeMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref, changeMenu]);
};

const Menu = ({ user: { role } }) => {
  const { t, i18n } = useTranslation();
  const [showMenu, changeMenu] = useState(false);
  const wrapperRef = useRef(null);
  useOutsideAlerter(wrapperRef, changeMenu);

  const displayRole = r => {
    switch (r) {
      case 'anonymous':
        return <Link to='/login'>{t('menu_login')}</Link>;
      case 'user':
        return <Link to='/profile'>{t('menu_user')}</Link>;
      case 'admin':
        return <Link to='/admin'>{t('menu_admin')}</Link>;
      default:
        return <Link to='/login'>{t('menu_login')}</Link>;
    }
  };

  const changeLang = ln => {
    localStorage.setItem('lng', ln);
    moment.locale(ln);
    i18n.changeLanguage(ln);
  };

  const clg = localStorage.getItem('lng') ?? 'en';
  if (!localStorage.getItem('lng')) moment.locale('en');

  return showMenu ? (
    <ul id='menu-list' ref={wrapperRef}>
      <li>
        <Link to='/'>{t('menu_home')}</Link>
      </li>
      <li>
        <Link to='/list'>{t('menu_list')}</Link>
      </li>
      <li>
        <Link to='/contact'>{t('menu_contact')}</Link>
      </li>
      <li>{displayRole(role)}</li>
      <li className='lang-switcher'>
        <button
          type='button'
          className={clg === 'en' ? 'clg' : ''}
          onClick={() => changeLang('en')}
        >
          en
        </button>
        <button
          type='button'
          className={clg === 'hu' ? 'clg' : ''}
          onClick={() => changeLang('hu')}
        >
          hu
        </button>
      </li>
    </ul>
  ) : (
    <button
      type='button'
      id='menu-btn'
      onClick={() => changeMenu(true)}
      onKeyDown={() => changeMenu(true)}
    >
      {t('menu_invoke')}
    </button>
  );
};

const mapStateToProps = state => ({
  user: state.user,
});

Menu.propTypes = {
  user: PropTypes.shape({
    role: PropTypes.oneOf(['admin', 'user', 'anonymous', 'stranger'])
      .isRequired,
  }).isRequired,
};

export default connect(mapStateToProps)(Menu);
