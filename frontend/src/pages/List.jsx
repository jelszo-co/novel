import React from 'react';
import { useTranslation } from 'react-i18next';

const List = () => {
  const { t } = useTranslation();
  return (
    <div id='list'>
      <Title text={t('list_title')} />
    </div>
  );
};

export default List;
