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
`

export default function Content(): React.Node {
  return <ReactMarkdown>{enUS}</ReactMarkdown>;
}