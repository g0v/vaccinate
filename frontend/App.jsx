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
import Navbar from './Components/Navbar';
import About from './Components/About';
import Home from './Pages/Home';

import i18n from './i18n';

export default function App(): React.Node {
  return (
    <I18nextProvider i18n={i18n}>
      <Router>
        <G0vbar />
        <Navbar />
        <div className="container">
          <div className="alert alert-danger mt-4" role="alert">
            This site is currently under heavy development in preparation for the next wave of
            COVID-19 Vaccinations. We&apos;re keeping it online in-case it detects any appointments
            that are cancelled, but expect things to break until we remove this message.
          </div>
          <Switch>
            <Route path="/criteria">
              <Criteria />
            </Route>
            <Route path="/about">
              <About />
            </Route>
            <Route path="/">
              <Home />
            </Route>
          </Switch>
          <p><i>Created with love by a member of g0v, Taiwan civic tech community.</i></p>
        </div>
      </Router>
    </I18nextProvider>
  );
}
