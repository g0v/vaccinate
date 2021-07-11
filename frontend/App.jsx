// @flow
import * as React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';

import G0vbar from './Components/G0vbar';
import Criteria from './Components/Criteria';
import Credits from './Pages/Credits';
import Home from './Pages/Home';
import Navbar from './Components/Navbar';
import About from './Components/About';

import i18n from './i18n';

export default function App(): React.Node {
  return (
    <I18nextProvider i18n={i18n}>
      <Router>
        <G0vbar />
        <Navbar />
        <div className="container px-4 mt-2">
          <Switch>
            <Route path="/about">
              <About />
            </Route>
            <Route path="/criteria">
              <Criteria />
            </Route>
            <Route path="/credits">
              <Credits />
            </Route>
            <Route path="/">
              <Home />
            </Route>
          </Switch>
          <p className="text-center">This tool is created by the contributors in g0v.tw with love in CC0.</p>
        </div>
      </Router>
    </I18nextProvider>
  );
}
