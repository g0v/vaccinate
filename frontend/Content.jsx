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

### How can I help?
This website relies on crawling hospital websites to get real-time
information. We need your help to build the rest! Please join the
g0v slack and fork our code on [GitHub](https://github.com/g0v/vaccinate)
`;

const zhTW = `
### 誰能夠接種 COVID-19 疫苗？
COVID-19 公費疫苗已開放給公費疫苗接種對象。詳細資料請參考
[衛生福利部疾病管理署官網](https://www.cdc.gov.tw/Category/Page/9mcqWyq51P_aYADuh3rTBA)。
此外，COVID-19 自費疫苗也開放給任何有出國需求在台的人。接種對象不限國籍。

### 現在能夠打哪一種疫苗？
疾病管理署正在供應 AstraZeneca 的疫苗。

### 該怎麼使用本網站？
如果在您附近的醫院旁邊看到「Available」的話，表示醫院有自費 COVID-19 疫苗名額。
請直接往醫院官網報名。如果顯示「No Data」，表示本網不提供醫院顯示名額狀況的訊息。
請跟隨連接，跟醫院直接查詢名額。

### 本網站是由誰開發的？
本網站由 [g0v](https://g0v.tw) 公民科技社群內的 Civic Hacker 開發的。非官方頁面。如需要
官方諮詢，請查看[衛生福利部疾病管理署官網](https://cdc.gov.tw).

### 你能夠怎麼協助本網？
本網透過扒醫院官網的方式提供現時的名額資訊。總共有 31 個網站。小編無法一個人寫那麼多！
如果您有興趣幫忙的話，請加入 g0v 的 Slack 並且 Fork 我們在
[GitHub](https://github.com/g0v/vaccinate) 上的 Code!

Please help me translate this text. Contribute by adding to
[this file](https://github.com/g0v/vaccinate/blob/master/frontend/Content.jsx)
`;

const bahasa = `
Bahasa translation is a work in progress. Please contribute by 
adding to [this file](https://github.com/g0v/vaccinate/blob/master/frontend/Content.jsx)
`;

const ja = `
Japanese translation is a work in progress. Please contribute by 
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
    case 'ja':
      return ja;
    default:
      return zhTW;
  }
}

export default function Content(): React.Node {
  const [language, setLanguage] = React.useState('zhTW');
  return (
    <>
      <div style={{ textAlign: 'center' }}>
        <div
          className="btn-group"
          role="group"
          aria-label="Basic outlined example"
        >
          <button type="button" onClick={() => setLanguage('enUS')} className="btn btn-outline-primary">English</button>
          <button type="button" onClick={() => setLanguage('zhTW')} className="btn btn-outline-primary">華語</button>
          <button type="button" onClick={() => setLanguage('id')} className="btn btn-outline-primary">Bahasa</button>
          <button type="button" onClick={() => setLanguage('ja')} className="btn btn-outline-primary">日本語</button>
        </div>
      </div>
      <div style={{ marginTop: 10 }}>
        <ReactMarkdown>{getContent(language)}</ReactMarkdown>
      </div>
    </>
  );
}
