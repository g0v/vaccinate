from flask import Flask, render_template, json, wrappers
import argparse
import redis, csv, sys, os
from typing import TypedDict, Tuple, Dict, Callable, List, Any, Optional
from enum import Enum
import requests
from bs4 import BeautifulSoup

# Project imports
import local_scraper
from hospital_types import (
    Hospital,
    HospitalID,
    AppointmentAvailability,
    ScrapedData,
    HospitalAvailabilitySchema,
)


redis_host: Optional[str] = os.environ.get("REDIS_HOST")
redis_port: Optional[str] = os.environ.get("REDIS_PORT")
redis_username: Optional[str] = os.environ.get("REDIS_USERNAME")
redis_password: Optional[str] = os.environ.get("REDIS_PASSWORD")


app = Flask(
    __name__,
    static_url_path="",
    static_folder="../dist",
    template_folder="../dist",
)


def get_availability_from_server() -> List[ScrapedData]:
    # The decode_repsonses flag here directs the client to convert the responses from Redis into Python strings
    # using the default encoding utf-8.  This is client specific.
    r: redis.StrictRedis = redis.StrictRedis(
        host=redis_host,
        port=redis_port,
        password=redis_password,
        decode_responses=True,
        username=redis_username,
        ssl=True,
    )

    hospital_ids = list(range(1, 32))

    def get_availability(
        hospital_id: int,
    ) -> ScrapedData:
        raw_availability = r.hgetall("hospital_schema_2:" + str(hospital_id))

        if raw_availability == {}:
            return (
                hospital_id,
                {
                    "self_paid": AppointmentAvailability.NO_DATA,
                    "government_paid": AppointmentAvailability.NO_DATA,
                },
            )

        def read_availability(raw: str) -> AppointmentAvailability:
            if raw == "AppointmentAvailability.AVAILABLE":
                return AppointmentAvailability.AVAILABLE
            elif raw == "AppointmentAvailability.UNAVAILABLE":
                return AppointmentAvailability.UNAVAILABLE
            else:
                return AppointmentAvailability.NO_DATA

        availability: HospitalAvailabilitySchema = {
            "self_paid": read_availability(raw_availability["self_paid"]),
            "government_paid": read_availability(raw_availability["government_paid"]),
        }
        return (hospital_id, availability)

    availability: List[ScrapedData] = [
        get_availability(hospital_id) for hospital_id in hospital_ids
    ]
    print(availability)
    return availability


def hospitalData() -> List[Hospital]:
    should_scrape = app.config["scrape"]
    availability = (
        dict(local_scraper.get_hospital_availability())
        if should_scrape
        else dict(get_availability_from_server())
    )

    app.logger.warning(availability)
    with open("../data/hospitals.csv") as csvfile:
        reader = csv.DictReader(csvfile)
        rows = []
        for row in reader:
            hospital_id = int(row["編號"])
            hospital: Hospital = {
                "address": row["地址"],
                "selfPaidAvailability": availability[hospital_id]["self_paid"],
                "department": row["科別"],
                "governmentPaidAvailability": availability[hospital_id][
                    "government_paid"
                ],
                "hospitalId": int(row["編號"]),
                "location": row["縣市"],
                "name": row["醫院名稱"],
                "phone": row["電話"],
                "website": row["Website"],
            }
            rows.append(hospital)
        return rows


@app.route("/hospitals")
def hospitals() -> wrappers.Response:
    data = hospitalData()
    response = app.response_class(
        response=json.dumps(data),
        status=200,
        mimetype="application/json",
    )
    return response


@app.route("/")
def index() -> str:
    return render_template("./index.html")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description="Server to serve scraped vaccine availability data."
    )
    parser.add_argument(
        "--scrape",
        action="store_true",
        default=False,
        help="""Usually the Flask app will read from a Redis database.
        This flag will scrape the data locally on machine. It's useful for testing.
        """,
    )
    flag_values: argparse.Namespace = parser.parse_args()
    app.config["scrape"] = flag_values.scrape
    app.run(debug=True, host="0.0.0.0")
