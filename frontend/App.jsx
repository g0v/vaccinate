// @flow
import React, { useContext } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';

import LocaleContext from './Context/Locale'

import G0vbar from './Components/G0vbar';
import Criteria from './Components/Criteria';
import Navbar from './Components/Navbar';
import LanguageSelector from './Components/LanguageSelector';
import Home from './Pages/Home';
// $FlowFixMe: Flow doesn't like importing Yaml but Parcel can.
import strings from './Strings/App.yaml';

export default function App(): React.Node {
  const userLanguage = navigator.language.split('-')[0];
  const [locale: Locale, setLocale] = React.useState(userLanguage);

  return (
    <Router>
      <LocaleContext.Provider value={{ locale, changeLocale: setLocale }}>
        <G0vbar />
        <Navbar />
        <div className="container">
          <LanguageSelector />
          <h1 style={{ textAlign: 'center', marginTop: 30 }}>{strings.websiteTitle[locale]}</h1>
          <Switch>
            <Route path="/criteria">
              <Criteria />
            </Route>
            <Route path="/">
              <Home />
            </Route>
          </Switch>
          <p><i>Created with love by a member of g0v, Taiwans civic tech community.</i></p>
        </div>
      </LocaleContext.Provider>
    </Router>
  );
}
