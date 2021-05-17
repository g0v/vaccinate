// @flow
import * as React from 'react';
import ReactMarkdown from 'react-markdown';

import type { Language } from '../Types/Locale';

const enUS = `
### Who can get the COVID-19 vaccine?
You can get the COVID-19 vaccine for free if you are part of
the eligible groups set by the Taiwanese government. 

### Are there self-paid vaccines available? 
Self-paid vaccines were available for those who intended to travel
abroad. This program was ended by the CECC on May 15, 2021. 
If you previously got your first dose through this program, you
can schedule your second shot directly with your hospital. 

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
[衛生福利部疾病管制署官網](https://www.cdc.gov.tw/Category/Page/9mcqWyq51P_aYADuh3rTBA)。
此外，COVID-19 自費疫苗也開放給任何有出國需求在台的人。接種對象不限國籍。

### 有 COVID-19 自費疫苗嗎？
根據指揮中心5月15號的記者會，現在無法註冊自費疫苗名額。如果您已經接種第一劑疫苗的話
可直接聯絡醫院預約接種第二劑疫苗。

### 現在能夠打哪一種疫苗？
疾病管制署正在供應 AstraZeneca 的疫苗。

### 該怎麼使用本網站？
如果在您附近的醫院旁邊看到「Available」的話，表示醫院有自費 COVID-19 疫苗名額。
請直接往醫院官網報名。如果顯示「No Data」，表示本網不提供醫院顯示名額狀況的訊息。
請跟隨連接，跟醫院直接查詢名額。

### 本網站是由誰開發的？
本網站由 [g0v](https://g0v.tw) 公民科技社群內的 Civic Hacker 開發的。非官方頁面。如需要
官方諮詢，請查看[衛生福利部疾病管制署官網](https://cdc.gov.tw).

### 你能夠怎麼協助本網？
本網透過扒醫院官網的方式提供現時的名額資訊。總共有 31 個網站。小編無法一個人寫那麼多！
如果您有興趣幫忙的話，請加入 g0v 的 Slack 並且 Fork 我們在
[GitHub](https://github.com/g0v/vaccinate)上的 Code!

Please help me translate this text. Contribute by adding to
[this file](https://github.com/g0v/vaccinate/blob/master/frontend/Components/Content.jsx)
`;

const bahasa = `
### Siapa yang bisa mendapatkan vaksin COVID-19?
Anda bisa mendapatkan vaksin COVID-19 secara gratis jika Anda termasuk dalam
kelompok yang memenuhi syarat yang ditetapkan oleh pemerintah Taiwan. Jika Anda
berniat bepergian ke luar Taiwan, Anda bisa membayar sendiri untuk mendapatkan vaksin.

### Vaksin apa yang tersedia?
Saat ini, pemerintah Taiwan sedang mengelola Vaksin AstraZeneca.

### Bagaimana cara menggunakan situs web ini?
Anda bisa menggunakannya untuk mencari rumah sakit di daerah Anda. Jika
kolom 'Ketersediaan' di sebelah kanan bertuliskan 'Tersedia', maka akan ada
vaksin COVID-19 yang bisa diberikan. Jika tertulis 'Tidak Tersedia', maka
rumah sakit tersebut tidak ada janji terbuka. Jika tertulis 'Tidak Ada Data',
artinya kami belum menemukan cara untuk menambahkan data ke situs web ini.
Tolong cek rumah sakit langsung dengan mengklik 'Daftar di sini'.

### Bagaimana saya dapat mempelajari lebih lanjut? 
* Ada bisa melihat [FAQ Bahasa Inggris oleh CDC Taiwan](https://www.cdc.gov.tw/File/Get/rJJ09nktKU7btX_ZTEo_4w)

### Siapa yang membangun situs web ini?
Situs web ini dibuat oleh sukarelawan dengan jaringan peretas sipil
[g0v](https://g0v.tw). Kami tidak terkait dengan pemerintah Taiwan
dan bukan merupakan sumber resmi. Untuk informasi resmi, silakan cek
[situs web CDC Taiwan](https://cdc.gov.tw). `;

const ja = `
### 誰が新型コロナウイルスワクチンを接種できますか？
台湾政府が定める接種対象グループに含まれる方は無料で接種できます。（参照:https://www.cdc.gov.tw/Category/Page/9mcqWyq51P_aYADuh3rTBA）

### 自己負担のワクチンはありますか？
台湾からの出国を検討中の方は、自己負担で接種可能でしたが、CECCはこの制度を2021年5月15日に終了としました。
この制度を利用して1回目の接種を受けた方は、2回目の接種は病院へ直接予約することができます。

### どのワクチンを接種できますか？
現在、台湾政府が提供しているワクチンはアストラゼネカ社製のものとなります。

### このサイトはどのように使えばいいですか？
各病院名の欄に「Available」と表示されていれば、自己負担の新型コロナウイルスワクチンがあります。病院の公式サイトで直接登録してください。
「Unavailable」であれば、その病院には空いている予約枠はありません。
「No Data」であれば、このサイトでまだデータを提供できていないことを示します。
「Register here」をクリックして、直接病院の公式サイトをご確認ください。

### もっと詳しく知りたい場合は？
* [台湾CDC（衛生福利部疾病管制署）による英語のFAQはご参照いただけます](https://www.cdc.gov.tw/File/Get/rJJ09nktKU7btX_ZTEo_4w)

### 誰がこのサイトを作ったのですか？
このサイトはシビックテックのネットワークである [g0v](https://g0v.tw) のボランティアによって作られました。
台湾政府による公式情報ではありません。
公式情報は [台湾CDCのウェブサイト](https://cdc.gov.tw) をご覧ください。

### サイトをお手伝いできますか？
このサイトは病院のウェブサイトをクローリングしてリアルタイムに情報を反映しようとしています。
残っている部分を構築するには、みなさんのご協力が必要です。
ぜひ g0v の slack に参加して、[GitHub](https://github.com/g0v/vaccinate) からコードをフォークしてください。
`;

const ph = `
### Sino ang pwedeng magpabakuna laban sa COVID-19?
Maari kang makatanggap ng libreng bakuna laban sa COVID-19 kung ikaw ay nabibilang sa eligible na grupo na itinalaga ng gobyerno ng Taiwan. Kung ikaw ay may balak bumiyahe sa labas ng Taiwan, ikaw ay maaaring magbayad para sa sariling bakuna.

### Ano-ano ang mga bakunang mayroon sa Taiwan?
Sa ngayon, ang gobyerno ng Taiwan ay gumagamit ng bakunang AstraZeneca.

### Paano gamitin ang website na ito?
Hanapin ang mga ospital sa inyong lugar. Kung may nakalahad na "Available" sa itaas ng pangalan ng ospital, maari kayong magpaiskedyul ng appointment para sa bakuna na sarili mong babayaran. Kung "Unavailable", sa ngayon, wala pa pong makukuhang bakuna sa ospital na iyon. Kung "No Data" ang nakalahad, wala pa kaming mahahanap na impormasyon para sa ospital na iyon. Sa ganitong kaso, i-click ang "Visit Hospital Website" upang maicheck at makipagiskedyul ng appointment sa ospital na iyon.

### Saan ako pwedeng makakuha ng karagdagang impormasyon tungkol sa bakuna laban sa COVID-19? 
* [FAQs sa Ingles galing sa Taiwan CDC](https://www.cdc.gov.tw/File/Get/rJJ09nktKU7btX_ZTEo_4w)

### Sino ang gumawa ng website na ito?
Itong website ay gawa ng mga boluntaryo ng [g0v](https://g0v.tw) civic hacker network. Hindi ito konektado sa gobyerno ng Taiwan. Hindi rin ito isang opisyal na pahayag ng gobyerno. Para sa opisyal na impormasyon tungkol dito, maari kayong pumunta sa [website ng Taiwan CDC](https://cdc.gov.tw).

### Paano ako makakatulong?
Ang impormasyon na nakikita mo sa website na ito ay galing sa mga web crawlers na naghahanap ng real-time na impormasyon galing sa mga website ng mga ospital sa Taiwan. Kailangan namin ang tulong ninyo para mapalago ang impormasyon na ito. Kung interesado kayo, pwede kayong sumali sa aming slack channel o i-fork ang aming code sa [GitHub](https://github.com/g0v/vaccinate).
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
    case 'ph':
      return ph;
    default:
      return zhTW;
  }
}

export default function Content(props: {
  language: Language
}): React.Node {
  const { language } = props;
  return (
    <>
      <div style={{ marginTop: 10 }}>
        <ReactMarkdown>{getContent(language)}</ReactMarkdown>
      </div>
    </>
  );
}
