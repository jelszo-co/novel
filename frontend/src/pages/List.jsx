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
                  'Képzeljük el: bemegyünk egy házba, amit meg szeretnénk venni. Az ingatlanközvetítő pedig megkezdi a körbevezetést. Azonban a bútorok és szobák leírása helyett a házban elhunytak története tárul elénk.',
                uploadedAt: '2020-01-21T12:00:00.000Z',
              },

              {
                id: 2,
                title: 'Utolsó percek',
                path: 'elso-novellam',
                lore:
                  'Egy rövid történet arról, hogy mi történik az ember lelkében a vélt/valós halál előtt. Mire gondolunk, mit akarunk, hogyan próbálunk erősek maradni.',
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
                  'Mit is jelent a mai világban követni egy mozgalmat? Tudhatjuk, hogy valami radikális már a csatlakozás pillanatában? Vagy csak később döbbenünk rá, mit is tettünk? És ha igen, van még visszaút?',
                uploadedAt: '2021-01-01T12:00:00.000Z',
              },
            ],
          },
          {
            2018: [
              {
                id: 3,
                title: 'Egy igazán sötét történet',
                path: 'elso-harmadik',
                lore:
                  'Mi történik este a sötét sikátorokban? A fekete foltokban, ahova nem ér el a lámpa fénye? Mik lakoznak a homályban gyanútlan emberekre várva?',
                uploadedAt: '2021-01-01T12:00:00.000Z',
              },
            ],
          },
        ],

        EN: [],
      },
      param: '',
    };
    const { novels } = this.state;
    this.state = {
      ...this.state,
      listMode: novels.EN.length > 0 ? 'dual' : 'only',
    };
  }

  render() {
    const { listMode, param, novels } = this.state;
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
        const cNovels = Object.entries(yr)[0][1].filter(
          ({ title, lore }) => title.match(patt) || lore.match(patt),
        );
        return (
          <div key={cyr} className='yr-wrapper'>
            {+cyr !== new Date().getFullYear() && cNovels.length > 0 && (
              <div className='year-heading'>
                <h2>{cyr}</h2>
                <span className='list-line' />
              </div>
            )}
            {cNovels.map(({ id, title, lore, path, uploadedAt }, j) => (
              <div className='novel-card' key={id}>
                <Link to={`/novels/${path}`}>
                  <h3 className='novel-title'>
                    {param ? highlight(title) : title}
                  </h3>
                  <p className='novel-lore'>{param ? highlight(lore) : lore}</p>
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
            placeholder={t('list_search')}
            onChange={e => this.setState({ param: e.target.value })}
          />
          <Search className='search-icon' />
        </div>
        <div id='hu' className={`list-container ${listMode}`}>
          {listNovels(novels.HU)}
        </div>
        {listMode === 'dual' && (
          <div
            id='en'
            className={`list-container ${listMode === 'dual' && 'dual-en'}`}
          >
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
