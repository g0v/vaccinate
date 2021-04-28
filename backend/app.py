from flask import Flask, render_template
import csv
import sys
from typing import TypedDict, Tuple
import requests
from bs4 import BeautifulSoup


app = Flask(
    __name__,
    static_url_path="",
    static_folder="../dist",
    template_folder="../dist",
)


HospitalID = int


class Hospital(TypedDict):
    id: HospitalID
    location: str
    name: str
    department: str
    phone: str
    address: str
    website: str


def parseNTUH() -> Tuple[HospitalID, bool]: 
    r = requests.get(
        "https://reg.ntuh.gov.tw/WebAdministration/VaccineRegPublic.aspx?Hosp=T0&Reg=",
        verify="../data/ntuh-gov-tw-chain.pem",
    )
    soup = BeautifulSoup(r.text, "html.parser")
    table = soup.find("table")
    links = table.find_all('a', string='掛號')
    app.logger.warn(links)
    # PEP8 Style: if list is not empty, then there are appointments
    return (3, bool(links))


PARSERS = [parseNTUH]


@app.route("/")
def index():
    availability = dict([f() for f in PARSERS])
    app.logger.warn(availability)
    with open("../data/hospitals.csv") as csvfile:
        reader = csv.DictReader(csvfile)
        rows = []
        for row in reader:
            website = None
            id = row["編號"]
            hospital: Hospital = {
                "id": row["編號"],
                "location": row["縣市"],
                "name": row["醫院名稱"],
                "department": row["科別"],
                "phone": row["電話"],
                "address": row["地址"],
                "website": row["Website"],
            }
            rows.append(hospital)
        return render_template("./index.html", rows=rows)


if __name__ == "__main__":
    app.run(debug=True)
