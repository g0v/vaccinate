// @flow
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import querystring from 'query-string';

import locales from '../Constants/Locales';
import { getCache, setCache } from '../cache';

export default function LanguageSelector(): React.Node {
  const { i18n } = useTranslation();
  const history = useHistory();

  const changeLang = (lang) => {
    const searchParams = querystring.parse(window.location.search);
    searchParams.lang = lang;

    history.push({
      search: `?${querystring.stringify(searchParams)}`,
    });

    setTimeout(() => {
      setCache('lang', lang);
      i18n.changeLanguage(lang);
    });
  };

  React.useEffect(() => {
    const searchParams = querystring.parse(window.location.search);

    const lang = searchParams.lang || getCache('lang') || 'en';
    changeLang(lang);
  }, [i18n]);

  return (
    <div>
      <div className="dropdown d-none d-lg-block">
        <button
          id="languageDropdown"
          className="btn btn-outline-secondary btn-sm dropdown-toggle"
          type="button"
          data-bs-toggle="dropdown"
          aria-expanded="false"
          aria-label="Select a language"
        >
          <i className="bi bi-globe" />
        </button>
        <ul
          className="dropdown-menu dropdown-menu-end"
          aria-labelledby="languageDropdown"
        >
          {
            Object.keys(locales).map((key) => (
              <li
                key={`lang_${key}`}
              >
                <button
                  className="dropdown-item"
                  type="button"
                  aria-label={locales[key].text}
                  onClick={() => { changeLang(locales[key].locale); }}
                >
                  {locales[key].text}
                </button>
              </li>
            ))
          }
        </ul>
      </div>
      <div className="d-block d-lg-none">
        <hr />
        <ul>
          {
            Object.keys(locales).map((key) => (
              <li
                key={`lang_${key}`}
              >
                <button
                  className="btn btn-link"
                  type="button"
                  aria-label={locales[key].text}
                  onClick={() => { i18n.changeLanguage(locales[key].locale); }}
                >
                  {locales[key].text}
                </button>
              </li>
            ))
          }
        </ul>
      </div>
    </div>
  );
}
