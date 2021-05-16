// @flow
import React from 'react';
import {
  Link,
  NavLink,
} from 'react-router-dom';

import { useLocaleContext } from '../Context/Locale';

// $FlowFixMe: Flow doesn't like importing Yaml but Parcel can.
import strings from '../Strings/Navbar.yaml';

export default function Navbar(): React.Node {
  const { locale } = useLocaleContext();

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
              activeClassName="active"
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
