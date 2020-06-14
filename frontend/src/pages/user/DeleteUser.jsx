import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { auth } from '../../firebase';
import { connect } from 'react-redux';

import { setPopup } from '../../actions/popup';

const DeleteUser = ({ setPopup }) => {
  const { t } = useTranslation();
  const [pass, setPass] = useState('');

  const handleSubmit = async e => {
    e.preventDefault();
    const user = auth().currentUser;
    const credential = auth.EmailAuthProvider.credential(user.email, pass);
    await user.reauthenticateWithCredential(credential);
    await user.delete();
    setPopup('Fiók sikeresen törölve.');
  };

  return (
    <form onSubmit={e => handleSubmit(e)}>
      <h1>{t('delete-title')}</h1>
      <p>{t('delete-lore')}</p>
      <input
        required
        type='password'
        value={pass}
        onChange={e => setPass(e.target.value)}
      />
      <input type='submit' value={t('delete')} />
    </form>
  );
};

export default connect(null, { setPopup })(DeleteUser);
