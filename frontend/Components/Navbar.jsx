// @flow
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Link,
  NavLink,
} from 'react-router-dom';

export default function Navbar(): React.Node {
  const [t] = useTranslation('nav');

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
              {t('txt-appointments')}
            </NavLink>
            <NavLink
              exact
              to="/criteria"
              className="nav-link"
              aria-current="page"
            >
              {t('txt-vaccineCriteria')}
            </NavLink>
          </div>
        </div>
      </div>
    </nav>
  );
}
