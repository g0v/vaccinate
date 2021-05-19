# Locales

This directory contains all the locale files.
Each sub directory contains all text of a language.
E.g., "en" folder contains all text of English.

### Remind
This structure may be adjusted because it's not friendly enough for translators.
Besides, the design is still under planning.
Text will be added or deleted after the whole design is done.  

### Folder structure
* <code>[locale code]/</code>
  * <code>\*.yaml</code>: The key-value locale files. Common text, like "tlt-app", will be placed in <code>app.yaml</code>; while others will be managed by pages or modules. E.g., <code>card.yaml</code> is used for all text in Card component.
  * <code>index.js</code>: The main export file of the locale files.

### Meaning of the key-value
Consider a key, e.g., "tlt-app", as an index mapped to the value.
The value is the target text of a language.

E.g., target text <code>"COVID-19 Vaccination Information"</code> will be rendered when we call i18n API with the key <code>"tlt-app"</code> and <code>"en"</code> locale.
If we call API to get the text of <code>"tlt-app"</code> with locale <code>"zh"</code>, it shows <code>"全民新冠肺炎 (COVID-19) 疫苗資訊"</code>.

For translators, just need to check if a translation is appropriate by the scenario.
If they could be better, don't hesitate to improve them.

### Kind reminder
Some changes may break the program. To avoid this, there are tips need to be kept in mind.

- **DO NOT** modify the text in a curly brackets, because it may be a variable used by the program.
E.g., <code>txt-hello: "Hello, {{name}}"</code>. <code>name</code> is a variable here.

- **DO NOT** add / delete indents because it represents the hierarchy. When losing hierarchy, the program will fail to render the target text. 

### Prefix
The prefix is utilized to recognize the purpose of a text.
* <code>hdr-</code>: "header", the header text
* <code>tlt-</code>: "title", the title text
* <code>txt-</code>: "text", the paragraph text
* <code>btn-</code>: "button", the text in a button
* <code>lbl-</code>: "label", the label text of an input
* <code>tt-</code>: "tooltip", the tooltip text
* <code>plh-</code>: "placeholder", the placeholder of an input
* <code>msg-</code>: "message", the response message from the system

