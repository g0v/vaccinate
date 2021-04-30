// @flow
import * as React from 'react';
import ReactMarkdown from 'react-markdown';

const enUS = `
### Who can get the COVID-19 vaccine?
You can get the COVID-19 vaccine for free if you are part of
the eligible groups set by the Taiwanese government. If you
intend to travel outside of Taiwan, you may pay out-of-pocket
for a vaccine.

### What vaccines are available? 
Currently, the Taiwanese government is administering the
AstraZeneca vaccine. 

### How do I use this website? 
Look for hospitals in your area. If the 'Availability' column
on the right says 'Available', then there are COVID-19 out-of-pocket
vaccines available. If it says 'Unavailable', the hospital has
no open appointments. If it says 'No Data', we haven't found a
way to add the data to this website yet. Please check the
hospital directly by clicking on 'Register here'.

### How can I learn more? 
* [English FAQs by the Taiwan CDC](https://www.cdc.gov.tw/File/Get/rJJ09nktKU7btX_ZTEo_4w)

### Who built this website? 
This website was built by volunteers with the [g0v](https://g0v.tw) civic hacker
network. It is not associated with the Taiwanese government and
is not an official resource. For official information, please
check the [Taiwan CDC's website](https://cdc.gov.tw).
`;

const zhTW = `
## 誰能夠打COVID-19疫苗？
公費疫苗已經開放給

Please help me translate this text. Contribute by adding to
[this file](https://github.com/g0v/vaccinate/blob/master/frontend/Content.jsx)
`;

const bahasa = `
Bahasa translation is a work in progress. Please contribute by 
adding to [this file](https://github.com/g0v/vaccinate/blob/master/frontend/Content.jsx)
`;

function getContent(language: string): string {
  switch (language) {
    case 'enUS':
      return enUS;
    case 'zhTW':
      return zhTW;
    case 'id':
      return bahasa;
    default:
      return zhTW;
  }
}

export default function Content(): React.Node {
  const [language, setLanguage] = React.useState('enUS');
  return (
    <>
      <div style={{ textAlign: 'center' }}>
        <div
          className="btn-group"
          role="group"
          aria-label="Basic outlined example"
        >
          <button type="button" onClick={() => setLanguage('enUS')} className="btn btn-outline-primary">English</button>
          <button type="button" onClick={() => setLanguage('zhTW')} className="btn btn-outline-primary">台灣華語</button>
          <button type="button" onClick={() => setLanguage('id')} className="btn btn-outline-primary">Bahasa</button>
        </div>
      </div>
      <div style={{ marginTop: 10 }}>
        <ReactMarkdown>{getContent(language)}</ReactMarkdown>
      </div>
    </>
  );
}
