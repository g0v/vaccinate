// @flow
import * as React from 'react';
import ReactMarkdown from 'react-markdown';
import { readFileSync } from 'fs';

const en = readFileSync(`${__dirname}/../../Credits.md`, 'utf-8');

export default function Credits(): React.Node {
  return (
    <div style={{ marginTop: 10, maxWidth: 800 }}>
      <ReactMarkdown>{en}</ReactMarkdown>
    </div>
  );
}
