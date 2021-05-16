// @flow
import * as React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';

import G0vbar from './Components/G0vbar';
import Criteria from './Components/Criteria';
import Navbar from './Components/Navbar';
import LanguageSelector from './Components/LanguageSelector';
import Home from './Pages/Home';
// $FlowFixMe: Flow doesn't like importing Yaml but Parcel can.
import strings from './Strings/App.yaml';

import type { Locale, Language } from './Types/Locale';

export default function App(): React.Node {
  const [locale: Locale, setLocale] = React.useState('zh');
  const [language: Language, setLanguage] = React.useState('zhTW');

  return (
    <Router>
      <G0vbar locale={locale} />
      <Navbar locale={locale} />
      <div className="container">
        <LanguageSelector setLocale={setLocale} setLanguage={setLanguage} />
        <h1 style={{ textAlign: 'center', marginTop: 30 }}>{strings.websiteTitle[locale]}</h1>
        <Switch>
          <Route path="/criteria">
            <Criteria language={language} />
          </Route>
          <Route path="/">
            <Home language={language} locale={locale} />
          </Route>
        </Switch>
        <p><i>Created with love by a member of g0v, Taiwans civic tech community.</i></p>
      </div>
    </Router>
  );
}
