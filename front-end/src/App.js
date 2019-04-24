import React, { Component } from 'react'
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom'
import IntroDisplay from './components/IntroDisplay.js'
import VotingDisplay from './components/VotingDisplay.js'
import EndingDisplay from './components/EndingDisplay.js'
import NotFoundPage from './components/NotFoundPage.js'

import './styles/App.css'

class App extends Component {
  render() {
    return (
      <Router>
        <div>
          <Switch>
            <Route exact path="/" component={IntroDisplay} />
            <Route path="/voting" component={VotingDisplay} />
            <Route path="/ending" component={EndingDisplay} />
            <Route component={NotFoundPage} />
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App
