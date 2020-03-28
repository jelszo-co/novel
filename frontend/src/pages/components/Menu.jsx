import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

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

const Menu = () => {
  const { t } = useTranslation();
  const [role] = useState('anonymous');
  const [showMenu, changeMenu] = useState(false);
  const wrapperRef = useRef(null);
  useOutsideAlerter(wrapperRef, changeMenu);

  const displayRole = r => {
    switch (r) {
      case 'anonymous':
        return <Link to='/login'>{t('menu_login')}</Link>;
      case 'user':
        return <Link to='/account'>{t('menu_user')}</Link>;
      case 'admin':
        return <Link to='/admin'>{t('menu_admin')}</Link>;
      default:
        return <Link to='/login'>{t('menu_login')}</Link>;
    }
  };
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
    </ul>
  ) : (
    <button
      id='menu-btn'
      onClick={() => changeMenu(true)}
      onKeyDown={() => changeMenu(true)}
    >
      {t('menu_invoke')}
    </button>
  );
};

export default Menu;
