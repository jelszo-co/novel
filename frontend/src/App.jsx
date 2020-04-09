import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

// Redux
import { Provider } from 'react-redux';
import store from './store';
import { getNovels } from './actions/novels';
import { useTranslation } from 'react-i18next';

import './css/app.scss';

import Popup from './pages/components/Popup';
import Landing from './pages/Landing';
import List from './pages/List';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Novel from './pages/Novel';
import Err from './pages/404';

const App = () => {
  const { t } = useTranslation();
  useEffect(() => {
    store.dispatch(getNovels(t('err_novel_list')));
  }, [t]);
  return (
    <Provider store={store}>
      <Router data-test='router'>
        <Popup />
        <Switch>
          <Route exact path='/' component={Landing} />
          <Route exact path='/list' component={List} />
          <Route exact path='/contact' component={Contact} />
          <Route exact path='/login' component={Login} />
          <Route exact path='/novels/:title' component={Novel} />
          <Route component={Err} />
        </Switch>
      </Router>
    </Provider>
  );
};

export default App;
