import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Redirect, Route } from 'react-router-dom';
import Overview from './overview/Overview';
import Client from './Client';
import CreateClient from './create_client/CreateClient';

import './App.css'

class App extends Component {
  render() {
    return (
      <Router>
        <div className="App">
          <Switch>
            <Route exact path="/overview" component={Overview}/>
            <Route exact path="/mobileclient/:id" component={Client}/>
            <Route exact path="/newclient" component={CreateClient}/>
            {/* Default redirect */}
            <Redirect to="/overview"/>
            
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;
