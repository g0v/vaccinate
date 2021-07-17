// @flow
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { Link, NavLink } from 'react-router-dom';

import LanguageSelector from './LanguageSelector';

export default function Navbar(): React.Node {
  const [t] = useTranslation('nav');
  const [isShown, setIsShown] = React.useState(false);
  const navBarShown = isShown
    ? 'collapse navbar-collapse show'
    : 'collapse navbar-collapse';

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light sticky-top">
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/">
          💉 找疫苗 Find your vaxx
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNavAltMarkup"
          aria-controls="navbarNavAltMarkup"
          aria-expanded="false"
          aria-label="Toggle navigation"
          onClick={() => setIsShown(!isShown)}
        >
          <span className="navbar-toggler-icon" />
        </button>
        <div className={navBarShown} id="navbarNavAltMarkup">
          <div className="navbar-nav ms-auto me-4">
            <NavLink exact className="nav-link" to="/about">
              {t('txt-about')}
            </NavLink>
            <NavLink
              exact
              to="/credits"
              className="nav-link"
              aria-current="page"
            >
              {t('txt-credits')}
            </NavLink>
            <a
              href="https://www.readr.tw/project/3/covid19-vaccines-tracker"
              target="_blank"
              rel="noreferrer"
              className="nav-link"
            >
              {t('txt-eligibility')}
            </a>
          </div>
        </div>
        <LanguageSelector />
      </div>
    </nav>
  );
}
