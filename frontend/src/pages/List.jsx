import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import Moment from 'react-moment';
import { Link } from 'react-router-dom';
import Title from './components/Title';
import Menu from './components/Menu';

import { ReactComponent as Search } from '../assets/search.svg';

import '../css/all/list.scss';

class List extends Component {
  constructor(props) {
    super(props);
    this.state = {
      novels: {
        HU: {
          2020: [
            {
              id: 1,
              title: 'Első',
              path: 'elso',
              lore: 'Az én els novellám.',
              uploadedAt: '2020-01-01T12:00:00.000Z',
            },

            {
              id: 2,
              title: 'Második',
              path: 'elso-novellam',
              lore: 'Az én els novellám.',
              uploadedAt: '2020-01-01T12:00:00.000Z',
            },
          ],

          2021: [
            {
              id: 3,
              title: 'Harmadik',
              path: 'elso-harmadik',
              lore: 'Az én els novellám.',
              uploadedAt: '2021-01-01T12:00:00.000Z',
            },
          ],
        },

        EN: {},
      },
      param: '',
    };
    const { novels } = this.state;
    this.state = {
      ...this.state,
      listMode: Object.keys(novels.EN).length > 0 ? 'dual' : 'only',
    };
  }

  render() {
    const { listMode, param, novels } = this.state;
    const listNovels = inp => {
      const patt = new RegExp(`(${param.trim()})`, 'gi');
      const highlight = text => {
        const parts = text.split(patt);
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
      return Object.entries(inp).map(yr =>
        yr[1]
          .filter(({ title, lore }) => title.match(patt) || lore.match(patt))
          .map(({ id, title, lore, path, uploadedAt }) => {
            return (
              <div className='novel-card' key={id}>
                <Link to={`/novels/${path}`}>
                  <h3 className='novel-title'>
                    {param ? highlight(title) : title}
                  </h3>
                  <p className='novel-lore'>{param ? highlight(lore) : lore}</p>
                </Link>
                <div className='date-cont'></div>
                <Moment format='MMM'>{uploadedAt}</Moment>
                <br />
                <Moment format='D'>{uploadedAt}</Moment>
              </div>
            );
          }),
      );
    };

    const { t } = this.props;
    return (
      <div id='list'>
        <Menu />
        <Title>{t('list_title')}</Title>
        <div id='search'>
          <input
            type='text'
            name='search'
            id='search-bar'
            placeholder={t('search')}
            onChange={e => this.setState({ param: e.target.value })}
          />
          <Search className='search-icon' />
        </div>
        <div id='hu' className={`${listMode}`}>
          {listNovels(novels.HU)}
        </div>
        {listMode === 'dual' && (
          <div id='en' className={`${listMode}`}>
            {listNovels(novels.EN)}
          </div>
        )}
      </div>
    );
  }
}

List.propTypes = {
  t: PropTypes.func.isRequired,
};

export default withTranslation()(List);
