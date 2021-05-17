// @flow

import React from 'react';
import { useTranslation } from 'react-i18next';

import locales from '../Constants/Locales';

export default function LanguageSelector(): React.Node {
  const { i18n } = useTranslation();

  return (
    <div style={{ textAlign: 'center', marginTop: 20 }}>
      <form
        className="btn-group"
        role="group"
        aria-label="Select type of vaccination."
      >
        <div
          className="btn-group"
          role="group"
        >
          {
            Object.keys(locales).map((key) => (
              <button
                key={`lang_${key}`}
                type="button"
                onClick={() => {
                  i18n.changeLanguage(locales[key].locale);
                }}
                className="btn btn-outline-primary"
              >
                { locales[key].text }
              </button>
            ))
          }
        </div>
      </form>
    </div>
  );
}
