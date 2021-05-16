// @flow

import * as React from 'react';
import type { Language, Locale } from '../Types/Locale';

export default function LanguageSelector(
  props: {
    setLanguage: (Language) => void,
    setLocale: (Locale) => void },
): React.Node {
  const { setLocale, setLanguage } = props;
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
          aria-label="Basic outlined example"
        >
          <button
            type="button"
            onClick={() => { setLanguage('enUS'); setLocale('en'); }}
            className="btn btn-outline-primary"
          >
            English
          </button>
          <button
            type="button"
            onClick={() => { setLanguage('zhTW'); setLocale('zh'); }}
            className="btn btn-outline-primary"
          >
            華語
          </button>
          <button
            type="button"
            onClick={() => { setLanguage('id'); setLocale('en'); }}
            className="btn btn-outline-primary"
          >
            Bahasa Indonesia
          </button>
          <button
            type="button"
            onClick={() => { setLanguage('ja'); setLocale('en'); }}
            className="btn btn-outline-primary"
          >
            日本語
          </button>
          <button
            type="button"
            onClick={() => { setLanguage('ph'); setLocale('ph'); }}
            className="btn btn-outline-primary"
          >
            Tagalog
          </button>
        </div>
      </form>
    </div>
  );
}
