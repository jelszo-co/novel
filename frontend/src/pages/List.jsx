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
    this.yrWrapper = React.createRef();
    this.state = {
      novels: {
        HU: [
          {
            2020: [
              {
                id: 1,
                title: 'Ingatlan megtekintés',
                path: 'elso',
                lore:
                  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. At consectetur lorem donec massa sapien faucibus et molestie.',
                uploadedAt: '2020-01-21T12:00:00.000Z',
              },

              {
                id: 2,
                title: 'Utolsó percek',
                path: 'elso-novellam',
                lore:
                  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. At consectetur lorem donec massa sapien faucibus et molestie.',
                uploadedAt: '2020-01-01T12:00:00.000Z',
              },
            ],
          },

          {
            2019: [
              {
                id: 3,
                title: '...',
                path: 'elso-harmadik',
                lore:
                  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. At consectetur lorem donec massa sapien faucibus et molestie.',
                uploadedAt: '2021-01-01T12:00:00.000Z',
              },
            ],
          },
          {
            2018: [
              {
                id: 3,
                title: 'Negyedik',
                path: 'elso-harmadik',
                lore:
                  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. At consectetur lorem donec massa sapien faucibus et molestie.',
                uploadedAt: '2021-01-01T12:00:00.000Z',
              },
            ],
          },
        ],

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
            key={part}
            className={
              part.toLowerCase() === param.toLowerCase() ? 'matched' : ''
            }
          >
            {part}
          </span>
        ));
      };
      return inp.map((yr, i) => {
        const cyr = Object.keys(yr)[0];
        return (
          <div key={cyr} className='yr-wrapper'>
            {+cyr !== new Date().getFullYear() && (
              <div className='year-heading'>
                <h2>{cyr}</h2>
                <span className='list-line' />
              </div>
            )}
            {Object.entries(yr)[0][1]
              .filter(
                ({ title, lore }) => title.match(patt) || lore.match(patt),
              )
              .map(({ id, title, lore, path, uploadedAt }, j) => (
                <div className='novel-card' key={id}>
                  <Link to={`/novels/${path}`}>
                    <h3 className='novel-title'>
                      {param ? highlight(title) : title}
                    </h3>
                    <p className='novel-lore'>
                      {param ? highlight(lore) : lore}
                    </p>
                    {j !== Object.entries(yr)[0][1].length - 1 && (
                      <span className='list-line' />
                    )}
                  </Link>
                  <div
                    className={`date-cont ${j === 0 ? 'date-lowered' : null}`}
                  >
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
        <div id='hu' className={`list-container ${listMode}`}>
          {listNovels(novels.HU)}
        </div>
        {listMode === 'dual' && (
          <div id='en' className={`list-container ${listMode}`}>
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
