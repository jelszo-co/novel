import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import cookie from 'react-cookies';

// Redux
import { Provider } from 'react-redux';
import store from './store';
import { getNovels } from './actions/novels';

import './css/app.scss';

import Popup from './pages/components/Popup';
import Landing from './pages/Landing';
import List from './pages/List';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Novel from './pages/Novel';
import Profile from './pages/user/Profile';
import Admin from './pages/admin/Admin';
import Err from './pages/404';
import DeleteUser from './pages/user/DeleteUser';
import UpdateEmail from './pages/user/UpdateEmail';
import UpdatePass from './pages/user/UpdatePass';
import ResetPass from './pages/user/ResetPass';
import ActionCenter from './pages/components/ActionCenter';

import { auth } from './firebase';
import { AUTH_FAIL } from './actions/types';
import { loadUser } from './actions/user';

const App = () => {
  useEffect(() => {
    store.dispatch(getNovels());
    auth().onAuthStateChanged(async user => {
      if (user) {
        const token = await user.getIdToken(true);
        cookie.save('usertoken', token, { path: '/', sameSite: 'lax' });
        store.dispatch(loadUser(user));
      } else {
        store.dispatch({ type: AUTH_FAIL });
        cookie.remove('usertoken');
      }
    });
  }, []);
  return (
    <Provider store={store}>
      <Router>
        <Popup />
        <Switch>
          <Route exact path='/' component={Landing} />
          <Route exact path='/list' component={List} />
          <Route exact path='/contact' component={Contact} />
          <Route exact path='/login' component={Login} />
          <Route exact path='/novels/:title' component={Novel} />

          <Route exact path='/profile' component={Profile} />
          <Route exact path='/delete' component={DeleteUser} />
          <Route exact path='/update-email' component={UpdateEmail} />
          <Route exact path='/update-pass' component={UpdatePass} />
          <Route exact path='/reset-pass' component={ResetPass} />
          <Route exact path='/action-center' component={ActionCenter} />

          <Route exact path='/admin' component={Admin} />

          <Route component={Err} />
        </Switch>
      </Router>
    </Provider>
  );
};

export default App;
