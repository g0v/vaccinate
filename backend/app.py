from flask import Flask, render_template, json
import csv
import sys
from typing import TypedDict, Tuple, Dict, Callable, List, Any
from enum import Enum
import requests
from bs4 import BeautifulSoup
from hospital_types import Hospital, HospitalID, AppointmentAvailability

# Parsers
from Parsers.ntu_taipei import *
from Parsers.ntu_hsinchu import *
from Parsers.ntu_yunlin import *
from Parsers.tzuchi_taipei import *


app = Flask(
    __name__,
    static_url_path="",
    static_folder="../dist",
    template_folder="../dist",
)


def errorBoundary(
    f: Callable[[], Tuple[HospitalID, AppointmentAvailability]]
) -> Callable[[], Tuple[HospitalID, AppointmentAvailability]]:
    def boundariedFunction() -> Callable[
        [], Tuple[HospitalID, AppointmentAvailability]
    ]:
        try:
            return f()
        except:
            return lambda x: (0, AppointmentAvailability.NO_DATA)

    return boundariedFunction


PARSERS: List[Callable[[], Tuple[HospitalID, AppointmentAvailability]]] = [
    errorBoundary(parseNTUH),
    errorBoundary(parseNTUHHsinchu),
    errorBoundary(parseNTUHYunlin),
    errorBoundary(parseTzuchiTaipei),
]


def hospitalData() -> List[Hospital]:
    availability: Dict[HospitalID, AppointmentAvailability] = dict(
        [f() for f in PARSERS]
    )
    with open("data/hospitals.csv") as csvfile:
        reader = csv.DictReader(csvfile)
        rows = []
        for row in reader:
            hospital_id = int(row["編號"])
            hospital_availability = (
                availability[hospital_id].value
                if hospital_id in availability
                else AppointmentAvailability.NO_DATA.value
            )
            hospital: Hospital = {
                "address": row["地址"],
                "availability": hospital_availability,
                "department": row["科別"],
                "hospitalId": int(row["編號"]),
                "location": row["縣市"],
                "name": row["醫院名稱"],
                "phone": row["電話"],
                "website": row["Website"],
            }
            rows.append(hospital)
        return rows


@app.route("/hospitals")
def hospitals() -> Any:
    data = hospitalData()
    response = app.response_class(
        response=json.dumps(data),
        status=200,
        mimetype="application/json",
    )
    app.logger.warn(response)
    return response


@app.route("/")
def index() -> str:
    return render_template("./index.html")


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0")
