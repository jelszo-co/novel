import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import Title from './components/Title';
import Menu from './components/Menu';

class List extends Component {
  constructor(props) {
    super(props);
    this.state = {
      novels: {
        HU: {
          '2020': [
            {
              title: 'Első',
              path: 'elso',
              lore: 'Az én els novellám.',
              'uploaded-at': '2020-01-01T12:00:00.000Z',
            },

            {
              title: 'Második',
              path: 'elso',
              lore: 'Az én els novellám.',
              'uploaded-at': '2020-01-01T12:00:00.000Z',
            },
          ],

          '2021': [
            {
              title: 'Harmadik',
              path: 'elso',
              lore: 'Az én els novellám.',
              'uploaded-at': '2021-01-01T12:00:00.000Z',
            },
          ],
        },

        EN: {},
      },
      param: '',
    };
    this.state = {
      ...this.state,
      listMode: Object.keys(this.state.novels.EN).length > 0 ? 'dual' : 'only',
    };
  }

  render() {
    const { listMode, param, novels } = this.state;
    const listNovels = inp => {
      const patt = new RegExp(`${param}`, 'gi');
      return Object.entries(inp).map(yr =>
        yr[1]
          .filter(
            ({ title, path, lore }) =>
              title.match(patt) || lore.match(patt) || path.match(patt),
          )
          .map(novel => novel.title),
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
            id='search'
            onChange={e => this.setState({ param: e.target.value })}
          />
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

export default withTranslation()(List);
