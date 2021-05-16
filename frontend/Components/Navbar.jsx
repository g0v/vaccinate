// @flow
import * as React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  NavLink,
} from 'react-router-dom';
// $FlowFixMe: Flow doesn't like importing Yaml but Parcel can.
import strings from '../Strings/Navbar.yaml';

import type { Locale } from '../Types/Locale';

export default function Navbar(props: { locale: Locale }): React.Node {
  const { locale } = props;
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light sticky-top">
      <div className="container">
        <Link className="navbar-brand" to="/">Vaxx.tw</Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNavAltMarkup"
          aria-controls="navbarNavAltMarkup"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
          <div className="navbar-nav">
            <NavLink
              exact
              activeClassname="active"
              className="nav-link"
              to="/"
            >
              {strings.appointments[locale]}
            </NavLink>
            <NavLink
              exact
              to="/criteria"
              className="nav-link"
              aria-current="page"
            >
              {strings.vaccineCriteria[locale]}
            </NavLink>
          </div>
        </div>
      </div>
    </nav>
  );
}
