# Vaxx.tw
![image](https://user-images.githubusercontent.com/8745371/119945854-94751e80-bfc8-11eb-8aff-504b36f7fb99.png)

**UPDATE: As of May 31, 2021, this project is currently on hiatus. We await seeing what is necessary as the Taiwanese government's central vaccination system comes online**

## Hiatus Message
大家好！
根據上個禮拜跟政府官員以及立委的討論，我認為我們應該暫時停工 vaxx.tw 的開發。政府現在正在開發中央統一預約系統。我們先等統一疫苗預約系統上線之後，再討論我們可以在那些方面繼續協助。政府的 1922 網站成功上線後，我將把 vaxx.tw 的名額查詢功能關掉，留下公費疫苗對象的翻譯。
這幾個禮拜，真的太感恩大家的共同合作。我們透過彼此的努力：
* 把網站內容翻譯成超過5個不同的語言。
* 支援國內過半的醫院的現時自費疫苗資訊。
* 整理了國內公費疫苗接種地點的資料。
希望大家在家好好休息，照顧自己。我們將關注 1922 上線，看我們到時候可以在怎麼協助。關於疫苗類的問題歡迎繼續在這個頻道裡！

Hi everyone,
After reflecting on our meeting between government officials on Saturday, I believe we should pause development on vaxx.tw. The government is currently developing a centralized reservation system. Let's wait on that going online before strategizing on our next steps. After 1922.gov.tw comes online, I will turn off the reservation component of vaxx.tw, leaving up the translations of the vaccine target groups.
I am so grateful for everyone's work over the past few weeks. Through your hard work, we:
* Translated the site into 5 different languages.
* Supported over half of the self-paid hospitals in Taiwan.
* Cleaned up the data for government-paid vaccine locations.
I hope everyone gets some rest, takes care of ourselves. We'll talk again after 1922 goes online and see how we can help. Other vaccine discussions are of course, always welcome in this channel!

## Mission

整理台灣所有自費接種疫苗的資料
Collecting all the information about self-paid vaccines in Taiwan. 

## Set up project
Make sure you have [pipenv](https://pypi.org/project/pipenv/) installed. 
1. git clone the repository
2. run `pipenv install`.
3. run `yarn`
4. run `yarn prepare`. This is for pre-commit command setup.
5. In one terminal, run `yarn backend`. This starts the Python Flask server. 
6. In another terminal, run `yarn frontend`. This starts Parcel, our JS bundler. 

## Translations
To make sure we're serving all of Taiwan it's imperative we translate to all the languages spoken here. I haven't settled on an i18n approach I'm happy with yet, but for now, to localize into a new language:
1. Translate the blurb in [Content.jsx](https://github.com/g0v/vaccinate/blob/master/frontend/Components/Content.jsx). This is the main content that shows on the site when arriving.
2. Translate the strings that live in the [Strings folder](https://github.com/g0v/vaccinate/tree/master/frontend/Strings).
3. Translate the content for the top [G0v banner](https://github.com/g0v/vaccinate/blob/master/frontend/Components/G0vbar.jsx).

To add support for a locale once all strings have been localized, override the `setLocale('en')` method call in [Content.jsx](https://github.com/g0v/vaccinate/blob/master/frontend/Components/Content.jsx) and set it to whatever language code you used to localize. 

Current priority languages:
* Tagalog
* Japanese
* Korean

## Code Quality
[![Lint](https://github.com/g0v/vaccinate/actions/workflows/main.yml/badge.svg)](https://github.com/g0v/vaccinate/actions/workflows/main.yml) [![TypeCheck](https://github.com/g0v/vaccinate/actions/workflows/typecheck.yaml/badge.svg)](https://github.com/g0v/vaccinate/actions/workflows/typecheck.yaml) [![Tests](https://github.com/g0v/vaccinate/actions/workflows/test.yaml/badge.svg)](https://github.com/g0v/vaccinate/actions/workflows/test.yaml)

Some principles this project operates under:
* Dependencies should only be introduced where only necessary. The only project non-dev dependency in JS so far is React. This keeps the project easy-to-maintain.
* Configuration is minimal. We're using all the defaults for [ParcelJS](https://parceljs.org/), a zero-configuration JavaScript bundler. 

This project uses:
* [AirBnB JavaScript](https://github.com/airbnb/javascript)
* [Flow](https://flow.org/) for JavaScript typechecking
* [Black](https://github.com/psf/black) for Python formatting
* [Pyre](https://pyrecheck.org) for Python type-checking with PEP484 Typehints.

## Architecture
This is an app in three parts:
1. A web app written in React. The code for this lives in `frontend/`.
2. A Local Scraper running on a machine in my living room. This is a python script that lives in `backend/local_scraper.py`. It is executed by-the-minute by a cronjob. It takes the results and uploads them to a Redis server. 
3. A Flask server written in Python. This server code lives in `backend/app.py`. This code runs on a DigitalOcean Droplet in Singapore. This droplet serves down the React app by reading the latest information from a Redis server and sending the data down. 

**Note:** Why separate the scraper from the droplet? Originally, I wanted to run everything on the droplet, but websites were blocking non-Taiwan IP addresses, so I was forced to find a scrape from Taiwan, which means a machine running on my family's network. 

When you are developing locally, instead of reading from the Redis server, it makes sense to scrape the data directly. Tthe `app.py` Flask server takes a `--scrape` flag, which when set will scrape locally instead of reading from the Redis server. 

## To write a scraper for a hospital
1. Open up data/hospitals.csv. Add your GitHub name as the owner next to that hospital. 
2. Note the ID for that hospital (e.g. 台大醫院 is 3.)
3. Write a scraper that makes a request to the webpage returns the ID and the `AppointmentAvailability` as a tuple (see examples)
4. Import your module in app.py and add your parser in the list of PARSERS. 
5. Run `yarn backend` and confirm that your code is correct
6. Make a Pull Request and tag @kevinjcliao to take a look. 

See [here](https://github.com/g0v/vaccinate/pull/1) for an example of a Pull Request. 

## Known Issues
* After adding a new Python dependency, pipenv gets pretty unhappy. Run `pipenv lock --pre --clear` to fix. I've aliased this to `yarn fixpipenv`.

## Discuss
We're chatting in the #vaccine channel of the [g0v Slack](https://join.g0v.tw/). Come say hi! :)

## About g0v
g0v is Taiwan's polycentric civic tech community. We're a network of volunteers who build websites that serve the public good. Join us for our next Hackathon! You can find dates on the [Jothon Team](https://jothon.g0v.tw/) website. 

## Thanks
If you were able to book a vaccine using this website, I'd love it if you'd consider throwing a couple bucks towards mutual aid or solidarity organizations in your area. Some ideas: 
* [People's Program Oakland](https://www.instagram.com/peoplesprograms/?hl=en)
* [Taiwan International Workers' Alliance](https://www.tiwa.org.tw/)

## Contributors
### Content:
* Kevin Liao
### Code:
* Kevin Liao and Yao Wei
### Translations:
* Bahasa: Dakota Pekerti and Andre Maure
* Mandarin: Kevin Liao
