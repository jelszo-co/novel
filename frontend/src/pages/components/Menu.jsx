import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

const Menu = () => {
  const { t } = useTranslation();
  const [role, setRole] = useState('anon');
  return (
    <div>
      <ul>
        <li>
          <Link to='/'>Kezdőlap</Link>
        </li>
        <li>
          <Link to='/list'>Novellák</Link>
        </li>
        <li>
          <Link to='/contact'>Kapcsolat</Link>
        </li>
      </ul>
    </div>
  );
};

export default Menu;
