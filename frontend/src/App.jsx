import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './css/app.scss';

import Landing from './pages/Landing';
import List from './pages/List';
import err404 from './pages/404';

const App = () => (
  <Router data-test='router'>
    <Switch>
      <Route exact path='/list' component={List} />
      <Route exact path='/' component={Landing} />
      <Route component={err404} />
    </Switch>
  </Router>
);

export default App;
