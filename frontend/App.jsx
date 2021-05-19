// @flow
import * as React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';
import { I18nextProvider, useTranslation } from 'react-i18next';

import G0vbar from './Components/G0vbar';
import Criteria from './Components/Criteria';
import Navbar from './Components/Navbar';
import LanguageSelector from './Components/LanguageSelector';
import Home from './Pages/Home';

import i18n from './i18n';

export default function App(): React.Node {
  const [gt] = useTranslation('app');

  return (
    <I18nextProvider i18n={i18n}>
      <Router>
        <G0vbar />
        <Navbar />
        <div className="container">
          <LanguageSelector />
          <h1 style={{ textAlign: 'center', marginTop: 30 }}>{gt('tlt-app')}</h1>
          <Switch>
            <Route path="/criteria">
              <Criteria />
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
