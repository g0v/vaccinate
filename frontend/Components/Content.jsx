// @flow
import * as React from 'react';
import ReactMarkdown from 'react-markdown';
import { useTranslation } from 'react-i18next';
import { readFileSync } from 'fs';

const enUS = readFileSync(__dirname + '/../Locales/en/content.md', 'utf-8');

const zhTW = readFileSync(__dirname + '/../Locales/zh/content.md', 'utf-8');

const bahasa = readFileSync(__dirname + '/../Locales/id/content.md', 'utf-8')

const ja = readFileSync(__dirname + '/../Locales/ja/content.md', 'utf-8');

const ph = readFileSync(__dirname + '/../Locales/tl/content.md', 'utf-8');

function getContent(locale: string): string {
  switch (locale) {
    case 'en':
      return enUS;
    case 'zh':
      return zhTW;
    case 'id':
      return bahasa;
    case 'ja':
      return ja;
    case 'tl':
      return ph;
    default:
      return enUS;
  }
}

export default function Content(): React.Node {
  const [, i18n] = useTranslation();
  return (
    <>
      <div style={{ marginTop: 10 }}>
        <ReactMarkdown>{getContent(i18n.language)}</ReactMarkdown>
      </div>
    </>
  );
}
