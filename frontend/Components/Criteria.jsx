// @flow
import * as React from 'react';
import ReactMarkdown from 'react-markdown';
import { useTranslation } from 'react-i18next';
import { readFileSync } from 'fs';

import type { Locale } from '../Types/Locale';

const zh = readFileSync(`${__dirname}/../Locales/zh/criteria.md`, 'utf-8');

const en = readFileSync(`${__dirname}/../Locales/en/criteria.md`, 'utf-8');

export default function Criteria(): React.Node {
  const getContent: (Locale) => string = (localeCode) => {
    switch (localeCode) {
      case 'en':
        return en;
      case 'zh':
        return zh;
      default:
        return en;
    }
  };

  const [, i18n] = useTranslation();
  const locale = i18n.language;

  return (
    <div style={{ marginTop: 10, maxWidth: 800 }}>
      {locale !== 'en' && locale !== 'zh' ? (
        <p>
          <i>
            Translation of the CECC Vaccine Guidelines is a work in-progress. Please help out
            by going to&nbsp;
            <a href="https://hackmd.io/JhYQy30cQ52RZBLs9bGE1Q">this document</a>
          </i>
        </p>
      ) : null}
      <ReactMarkdown>{getContent(locale)}</ReactMarkdown>
    </div>
  );
}
