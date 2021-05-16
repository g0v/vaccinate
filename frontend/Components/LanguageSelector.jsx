// @flow

import React from 'react';
import { useLocaleContext, locales } from '../Context/Locale'

export default function LanguageSelector(): React.Node {
  const { locale: localeCode, changeLocale } = useLocaleContext()

  return (
    <div style={{ textAlign: 'center', marginTop: 20 }}>
      <form
        className="btn-group"
        role="group"
        aria-label="Select type of vaccination."
      >
        <button
          className="btn btn-primary dropdown-toggle"
          type="button"
          data-bs-toggle="dropdown" aria-expanded="false"
        >
          { locales[localeCode].text }
        </button>
        <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
          {
            Object.values(locales).map((config, index) => (
              <li
                key={`lang_${index}`}
                className="dropdown-item"
                onClick={changeLocale.bind(this, config.locale)}
              >
                { config.text }
              </li>
            ))
          }
        </ul>
      </form>
    </div>
  );
}
