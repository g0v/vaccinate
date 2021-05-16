// @flow
import * as React from 'react';
import ReactMarkdown from 'react-markdown';

import { useLocaleContext } from '../Context/Locale';
import type { Locale } from '../Types/Locale';

const zh = `
## 公費疫苗對象
資料來源：[衛生福利部疾病管理署](https://www.cdc.gov.tw/Category/Page/9mcqWyq51P_aYADuh3rTBA)
### 維持醫療量能
1. 醫療院所之執業醫事人員
2. 醫療院所之非醫事人員(含集中檢疫所之非醫事人員)

### 中央及地方政府防疫人員
維持防疫體系運作之中央及地方政府重要官員
1. 衛生單位第一線防疫人員
2. 港埠執行邊境管制之海關檢查(Customs)、證照查驗(Immigration)、人員檢疫及動植物檢疫(Quarantine)、安全檢查及航空保安(Security)等第一線工作人員
3. 實際執行居家檢疫與居家隔離者關懷服務工作可能接觸前開對象之第一線人員(含提送餐等服務之村里長或村里幹事、垃圾清運之環保人員、心理諮商及特殊狀況親訪等人員)
4. 實際執行救災、救護人員(指消防隊及民間救護車執行緊急救護技術之第一線人員)
5. 第一線海巡、岸巡人員
6. 實施空中救護勤務人員

### 高接觸風險第一線工作人員
1. 國籍航空機組員、國際商船船員(含國籍船舶船員及權宜國籍船員)
2. 防疫車隊駕駛
3. 港埠CIQS以外之第一線作業人員:
    1. 於港埠入境旅客活動區域需接觸旅客之第一線工作人員
    2. 執行港口各類船舶之碼頭裝卸倉儲、港埠設施及職安、環保管理巡查，引水等各項作業，須與外籍船員接觸等第一線工作人員
4. 防疫旅宿實際執行居家檢疫工作之第一線人員
5. 因應疫情防治經中央流行疫情指揮中心認定有接種亟需之對象

### 因特殊情形必要出國者(註)
*由各該主管機關提具需求說明、預估接種人數及時程，向中央流行疫情指揮中心專案申請。再視疫苗進口期程及供應量整體評估提供。*
1. 因外交或公務奉派出國人員、以互惠原則提供我國外交人員接種之該國駐臺員眷等
2. 代表國家出國之運動員或選手

### 維持社會運作之必要人員
1. 警察
2. 憲兵

### 機構及社福照顧系統之人員及其受照顧者
1. 安養、養護、日間照顧、社福等長期照護機構之受照顧者
2. 安養、養護、日間照顧、社福等長期照護機構之照顧者及工作人員、居服員、社工人員
3. 矯正機關工作人員（戒護人員等）

### 維持國家安全正常運作之必要人員
1. 軍人
2. 軍事機關及國安單位之文職人員

### 65歲以上長者
65歲以上長者

### 可能增加感染及疾病嚴重風險
1. 19-64歲具有易導致嚴重疾病之高風險疾病者
2. 罕見疾病及重大傷病

### 50-64歲成人
50-64歲成人
`;

const en = `
## Who can get the COVID-19 Vaccine? 
Information source: [Taiwan Center for Disease Control](https://www.cdc.gov.tw/Category/Page/9mcqWyq51P_aYADuh3rTBA)

You can get the COVID-19 Vaccine if you meet any of the following criteria:

### You're Medical Personnel
1. All licensed medical staff in medical facilities 

2. All non-medical staff in medical facilities (including non-medical staff in
quarantine facilities) 

### You are a Front-Line Civil Servant

**Pandemic-prevention personnel in central and local governments are eligible
for the vaccine.**

1. Essential workers in both central and local government involved in
maintaining the functioning of pandemic-preventation system 
2. Front-line health workers 

3. Front-line workers engaged in customs, immigration, quarantine and security
(CIQS) at ports and borders 


4. Front-line workers  involved in the implementation of quarentine and home
quaratine orders, or caring for quarantined invididuals, who are at risk of
contact with those in quarantine (including food delivery workers, village
chiefs and village workers, waste management and environmental protection
workers, psychiatrists, and those visting in special circumstances)

5. Rescue personnel (which refers to firefighters, civic-ambulance services
and EMTs involved in front-line first aid work)

6. Front-line marine and coast guard workers 

7. Air-ambulance service staff 

---

### You're an Essential Worker with high risk of contact 

1. ROC-national flight crew, international shipping industry workers (including
nationals and expedient nationals)

2. Drivers for pandemic prevention vehicles 

3. Non-CIQS front-line port and border staff
    - Front-line workers involved in tourist activities in regions with
      tourists who have recently arrived 
    - Front-line workers involved in various types of work at ports and
      borders such as loading and unloading storage, maintaining port
      and border facitilites and security, environmental checks and
      patrols, water diversion and related tasks, and those who must
      come into contact with foreign-national ship workers 

4. Front-line workers involved in quarantine implementation at quarantine
   hotels 

5. Those determined to be in need of vaccination in accordance with CDC
   guidelines 

### You're Traveling Abroad for a Special Purpose

*Different authorities will make an assessment, apply with the Central
Epidemic Command Center, and the CECC will make an eligibility recommendation
based on vaccination availability. 

1. Those who must travel abroad for diplomatic reasons. We will also vaccinate
diplomats from other countries if their countries vaccinate Taiwanese diplomats
abroad.

2. Athletes and competitors representing Taiwan abroad are eligible. 
---

### You're Involved in Public Safety

1. Police
2. Military Police

### You're a Caretaker in the Social Welfare System

1. You work in a nursing home, special care, daytime care, or other form of
long-term care facility. 


---

### You work in National Security

1. Military Personnel
2. Other Military Agency and Defence Personnel

### Your age places you at high-risk from COVID-19

You can get the vaccine if you're aged 65 and older

### You have a condition that makes you high-risk if you get COVID-19

1. You're in a high-risk category and you are aged between 19 and 64. 
2. You have a rare disease or a major injury. 


### You're between the ages of 50-64
Adults between 50 to 64 years old are now eligible for the COVID-19 vaccine. 

### You're planning on traveling abroad
Depending on vaccine availability, the Central Epidemic Command Center will
release a limited number of vaccines for people who fit certain criteria
and are willing to pay out-of-pocket. Examples of eligible groups include:
- Businesspeople
- Those with the need to travel abroad to work, study, or seek medical care.
`;

export default function Criteria(): React.Node {
  const { locale } = useLocaleContext();
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
