# Vaccinate
整理台灣所有自費接種疫苗的資料

# Architecture
* This is a Flask app serving a JavaScript web app. The frontend contains React, but we are not using it for anything at the moment. 

# Code style:
* AirBnB TypeScript
* Black for Python formatting
* Python typehints

# Contribute Data
* Help us add vaccination appointments to the CSV

# To write a parser for a hospital
1. Open up data/hospitals.csv. Add your GitHub name as the owner next to that hospital. 
2. Note the ID for that hospital (e.g. 台大醫院 is 3.)
3. Write a parser that makes a request to the webpage returns the ID and the `AppointmentAvailability` as a tuple (see examples)
4. Import your module in app.py and add your parser in the list of PARSERS. 
5. Run `yarn backend` and confirm that your code is correct
6. Make a PR and merge. 
