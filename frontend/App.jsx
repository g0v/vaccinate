// @flow
import * as React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';

import bootstrap from 'bootstrap/dist/js/bootstrap.bundle';
import G0vbar from './Components/G0vbar';
import Criteria from './Components/Criteria';
import Credits from './Pages/Credits';
import Home from './Pages/Home';
import Navbar from './Components/Navbar';
import About from './Components/About';
import InfoModal from './Components/InfoModal';

import i18n from './i18n';
import 'bootstrap/dist/css/bootstrap.css';

export default function App(): React.Node {
  return (
    <I18nextProvider i18n={i18n}>
      <Router>
        <G0vbar />
        <Navbar />
        <InfoModal />
        <div className="container px-4 my-2">
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
        </div>
      </Router>
    </I18nextProvider>
  );
}

window.onload = () => {
  // eslint-disable-next-line no-undef
  const infoModal = new bootstrap.Modal(document.getElementById('InfoModal'), { keyboard: false });
  infoModal.show();
};
