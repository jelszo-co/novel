import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './css/app.scss';

import Landing from './pages/Landing';
import List from './pages/List';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Err from './pages/404';

const App = () => (
  <Router data-test='router'>
    <Switch>
      <Route exact path='/' component={Landing} />
      <Route exact path='/list' component={List} />
      <Route exact path='/contact' component={Contact} />
      <Route exact path='/login' component={Login} />
      <Route component={Err} />
    </Switch>
  </Router>
);

export default App;
