// @flow
import * as React from 'react';
import ReactMarkdown from 'react-markdown';
import { useTranslation } from 'react-i18next';
import { readFileSync } from 'fs';

import type { Locale } from '../Types/Locale';

const en = readFileSync(`${__dirname}/../../Credits.md`, 'utf-8');

export default function Credits(): React.Node {
  return (
    <div style={{ marginTop: 10, maxWidth: 800 }}>
      <ReactMarkdown>{en}</ReactMarkdown>
    </div>
  );
}
