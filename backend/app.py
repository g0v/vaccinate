from flask import Flask, render_template
import csv
import sys
from typing import TypedDict, Tuple, Dict
from enum import Enum
import requests
from bs4 import BeautifulSoup


app = Flask(
    __name__,
    static_url_path="",
    static_folder="../dist",
    template_folder="../dist",
)


HospitalID = int


class AppointmentAvailability(Enum):
    AVAILABLE = "Available"
    UNAVAILABLE = "Unavailable"
    NO_DATA = "No data"


class Hospital(TypedDict):
    address: str
    availability: AppointmentAvailability
    department: str
    hospital_id: HospitalID
    location: str
    name: str
    phone: str
    website: str


def parseNTUH() -> Tuple[HospitalID, AppointmentAvailability]:
    r = requests.get(
        "https://reg.ntuh.gov.tw/WebAdministration/VaccineRegPublic.aspx?Hosp=T0&Reg=",
        verify="../data/ntuh-gov-tw-chain.pem",
    )
    soup = BeautifulSoup(r.text, "html.parser")
    table = soup.find("table")
    links = table.find_all("a", string="掛號")
    app.logger.warn(links)
    # PEP8 Style: if list is not empty, then there are appointments
    return (
        3,
        AppointmentAvailability.AVAILABLE
        if bool(links)
        else AppointmentAvailability.UNAVAILABLE,
    )


PARSERS = [parseNTUH]


@app.route("/")
def index():
    availability: Dict[HospitalID, AppointmentAvailability] = dict(
        [f() for f in PARSERS]
    )
    app.logger.warn(availability)
    with open("../data/hospitals.csv") as csvfile:
        reader = csv.DictReader(csvfile)
        rows = []
        for row in reader:
            hospital_id = int(row["編號"])
            app.logger.warn(hospital_id)
            hospital_availability = (
                availability[hospital_id].value
                if hospital_id in availability
                else AppointmentAvailability.NO_DATA
            )
            hospital: Hospital = {
                "address": row["地址"],
                "availability": hospital_availability,
                "department": row["科別"],
                "hospital_id": row["編號"],
                "location": row["縣市"],
                "name": row["醫院名稱"],
                "phone": row["電話"],
                "website": row["Website"],
            }
            rows.append(hospital)
        return render_template("./index.html", rows=rows)


if __name__ == "__main__":
    app.run(debug=True)
