# Vaccinate
整理台灣所有自費接種疫苗的資料
Collecting all the information about self-paid vaccines in Taiwan. 

## Set up project
Make sure you have [pipenv](https://pypi.org/project/pipenv/) installed. 
1. git clone the repository
2. run `pipenv install`.
3. run `yarn`
4. In one terminal, run `yarn backend`. This starts the Python Flask server. 
5. In another terminal, run `yarn frontend`. This starts Parcel, our JS bundler. 

## Code Quality
[![Lint](https://github.com/g0v/vaccinate/actions/workflows/main.yml/badge.svg)](https://github.com/g0v/vaccinate/actions/workflows/main.yml) [![TypeCheck](https://github.com/g0v/vaccinate/actions/workflows/typecheck.yaml/badge.svg)](https://github.com/g0v/vaccinate/actions/workflows/typecheck.yaml)

Some principles this project operates under:
* Dependencies should only be introduced where only necessary. The only project non-dev dependency in JS so far is React. This keeps the project easy-to-maintain.
* Configuration is minimal. We're using all the defaults for ParcelJS, a zero-configuration JavaScript bundler. 

This project uses:
* [AirBnB JavaScript](https://github.com/airbnb/javascript)
* [Flow](https://flow.org/) for JavaScript typechecking
* [Black](https://github.com/psf/black) for Python formatting
* [Pyre](https://pyrecheck.org) for Python type-checking with PEP484 Typehints.

## Architecture
This is an app in three parts: 
1. A web app written in React. The code for this lives in `frontend/`.
2. A Local Scraper running on a machine in my living room. This is a python script that lives in `backend/local_scraper.py`. It is executed by-the-minute by a cronjob. It takes the results and uploads them to a Redis server. 
3. A Flask server written in Python. This code runs on a DigitalOcean Droplet in Singapore. This droplet serves down the React app by reading the latest information from a Redis server and sending the data down. 

**Note:** Why separate the scraper from the droplet? Originally, I wanted to run everything on the droplet, but websites were blocking non-Taiwan IP addresses, so I was forced to find a scrape from Taiwan, which means a machine running on my family's network. 

When you are developing locally, instead of reading from the Redis server, it makes sense to scrape the data directly. Tthe `app.py` Flask server takes a `--scrape` flag, which when set will scrape locally instead of reading from the Redis server. 

## To write a parser for a hospital
1. Open up data/hospitals.csv. Add your GitHub name as the owner next to that hospital. 
2. Note the ID for that hospital (e.g. 台大醫院 is 3.)
3. Write a parser that makes a request to the webpage returns the ID and the `AppointmentAvailability` as a tuple (see examples)
4. Import your module in app.py and add your parser in the list of PARSERS. 
5. Run `yarn backend` and confirm that your code is correct
6. Make a PR and merge. 

## Known Issues
* After adding a new Python dependency, pipenv gets pretty unhappy. Run `pipenv lock --pre --clear` to fix.

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
