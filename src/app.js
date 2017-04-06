import React from "react";
import {render} from "react-dom";
import {Router, Route, IndexRoute, browserHistory} from 'react-router';

// Auth Store
import auth from './state/auth';

// import all store to instanciate them
import './state/demo';

// Default Components
import App from "../src/containers/App";
import Home from '../src/containers/Home';
import Login from '../src/containers/Login';

import Demo from '../src/containers/Demo';


function requireAuth(nextState, replace) {
  if (!auth.getStateValue('loggedIn')) {
    replace({
      pathname: '/login',
      state: { nextPathname: nextState.location.pathname }
    })
  }
}

render(
  (
    <Router history={browserHistory}>
      <Route path="/" component={App} onEnter={requireAuth}>
        <IndexRoute component={Home} />
        <Route path="demo" component={Demo} />
      </Route>
      <Route path="login" component={Login} />
    </Router>
  ),
  document.getElementById('main-app')
);
