import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Moment from 'react-moment';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Title from './components/Title';
import Menu from './components/Menu';

import { ReactComponent as Search } from '../assets/search.svg';

import '../css/all/list.scss';

const List = ({ novels: { loading, list } }) => {
  const { t } = useTranslation();
  const [param, setParam] = useState('');

  const listMode = list.EN?.length > 0 ? 'dual' : 'only';

  const listNovels = inp => {
    const patt = new RegExp(`(${param.trim()})`, 'gi');
    const highlight = text => {
      const parts = text.split(patt);
      if (param.length <= 2) {
        return text;
      }
      return parts.map((part, i) => (
        <span
          key={i}
          className={
            part.toLowerCase() === param.toLowerCase() ? 'matched' : ''
          }
        >
          {part}
        </span>
      ));
    };
    return inp.map(yr => {
      const cyr = Object.keys(yr)[0];
      const cNovels =
        param.length >= 3
          ? Object.entries(yr)[0][1].filter(({ title }) => title.match(patt))
          : Object.entries(yr)[0][1];
      return (
        <div key={cyr} className='yr-wrapper'>
          {+cyr !== new Date().getFullYear() && cNovels.length > 0 && (
            <div className='year-heading'>
              <h2>{cyr}</h2>
              <span className='list-line' />
            </div>
          )}
          {cNovels.map(({ title, lore, path, uploadedAt }, j) => (
            <div className='novel-card' key={title}>
              <Link to={`/novels/${path}`}>
                <h3 className='novel-title'>
                  {param ? highlight(title) : title}
                </h3>
                <p className='novel-lore'>{lore}</p>
                {j !== cNovels.length - 1 && <span className='list-line' />}
              </Link>
              <div className={`date-cont ${j === 0 ? 'date-lowered' : null}`}>
                <p className='date-mon'>
                  <Moment format='MMM'>{uploadedAt}</Moment>
                </p>
                <p className='date-day'>
                  <Moment format='D'>{uploadedAt}</Moment>
                </p>
              </div>
            </div>
          ))}
        </div>
      );
    });
  };

  return (
    !loading && (
      <div id='list'>
        <Menu />
        <Title>{t('list_title')}</Title>
        <div id='search'>
          <input
            type='text'
            name='search'
            id='search-bar'
            placeholder={t('list_search')}
            onChange={e => setParam(e.target.value)}
          />
          <Search className='search-icon' />
        </div>
        <div id='hu' className={`list-container ${listMode}`}>
          {listNovels(list.HU)}
        </div>
        {listMode === 'dual' && (
          <div
            id='en'
            className={`list-container ${listMode === 'dual' && 'dual-en'}`}
          >
            {listNovels(list.EN)}
          </div>
        )}
      </div>
    )
  );
};

const mapStateToProps = state => ({
  novels: state.novels,
});

export default connect(mapStateToProps, null)(List);
