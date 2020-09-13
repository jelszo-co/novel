import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import cookie from 'react-cookies';

// Redux
import { Provider } from 'react-redux';
import store from './store';
import { getNovels } from './actions/novels';

import './css/app.scss';

import Popup from './pages/components/Popup';
import Alert from './pages/components/Alert';
import Landing from './pages/Landing';
import List from './pages/List';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Novel from './pages/Novel';
import Profile from './pages/user/Profile';
import Admin from './pages/admin/Admin';
import Banned from './pages/admin/Banned';
import Err from './pages/404';
import DeleteUser from './pages/user/DeleteUser';
import UpdateEmail from './pages/user/UpdateEmail';
import UpdatePass from './pages/user/UpdatePass';
import ResetPass from './pages/user/ResetPass';
import ActionCenter from './pages/components/ActionCenter';
import ErrorBoundary from './pages/ErrorBoundary';
import EditWelcome from './pages/admin/EditWelcome';

import { auth } from './firebase';
import { AUTH_FAIL } from './actions/types';
import { loadUser } from './actions/user';
import { setAlert } from './actions/alert';

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
    /**
     * Override the default alert function
     * @param {localeString} title - Title of the alert
     * @param {localeString} text - Message of the alert
     * @param {boolean} [false] isPassword - Whether to display a pass input and an OK button
     * @param {function} [function=() => {}] callback - A callback fn
     */
    window.alert = (title, text, isInput, callback) =>
      store.dispatch(setAlert(title, text, isInput, callback));
  }, []);
  return (
    <ErrorBoundary>
      <Provider store={store}>
        <Router>
          <Popup />
          <Alert />
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
            <Route exact path='/admin/banned' component={Banned} />
            <Route exact path='/admin/welcome-edit' component={EditWelcome} />

            <Route component={Err} />
          </Switch>
        </Router>
      </Provider>
    </ErrorBoundary>
  );
};

export default App;
