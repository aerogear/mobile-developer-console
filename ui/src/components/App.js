import React from 'react';
import { BrowserRouter as Router, Switch, Redirect, Route } from 'react-router-dom';
import Overview from '../containers/Overview';
import Client from '../containers/Client';

import './App.css';

const App = () => (
  <Router>
    <div className="App">
      <Switch>
        <Route exact path="/overview" component={Overview} />
        <Route exact path="/mobileclient/:id" component={Client} />
        {/* Default redirect */}
        <Redirect to="/overview" />
      </Switch>
    </div>
  </Router>
);

export default App;
