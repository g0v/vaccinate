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

# The decode_responses flag here directs the client to convert the responses from Redis into Python strings
# using the default encoding utf-8.  This is client specific.
r: redis.StrictRedis = redis.StrictRedis(
    host=redis_host,
    port=redis_port,
    password=redis_password,
    decode_responses=True,
    username=redis_username,
    ssl=True,
)


app = Flask(
    __name__,
    static_url_path="",
    static_folder="../dist",
    template_folder="../dist",
)


def get_availability_from_server() -> Dict[HospitalID, HospitalAvailabilitySchema]:

    scraper_hospital_ids = list(map(lambda x: x.hospital_id, local_scraper.PARSERS))
    print(scraper_hospital_ids)

    def get_availability(
        hospital_id: HospitalID,
    ) -> ScrapedData:
        raw_availability = r.hgetall("hospital_schema_3:" + str(hospital_id))

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
        get_availability(hospital_id) for hospital_id in scraper_hospital_ids
    ]
    return dict(availability)


async def self_paid_hospital_data() -> List[Hospital]:
    should_scrape = app.config["scrape"]
    if should_scrape:
        availability = await local_scraper.get_hospital_availability()
    else:
        availability = get_availability_from_server()

    app.logger.warning(availability)
    with open("../data/hospitals.csv") as csvfile:
        reader = csv.DictReader(csvfile)
        rows = []
        for row in reader:
            hospital_id = row["公費疫苗醫院編號"]
            default_schema: HospitalAvailabilitySchema = {
                "self_paid": AppointmentAvailability.NO_DATA,
                "government_paid": AppointmentAvailability.NO_DATA,
            }
            hospital_availability: HospitalAvailabilitySchema = (
                availability[hospital_id]
                if hospital_id in availability
                else default_schema
            )
            hospital: Hospital = {
                "address": row["地址"],
                "selfPaidAvailability": hospital_availability["self_paid"],
                "department": row["科別"],
                "governmentPaidAvailability": hospital_availability["government_paid"],
                "hospitalId": hospital_id,
                "location": row["縣市"],
                "name": row["醫院名稱"],
                "phone": row["電話"],
                "website": row["Website"],
            }
            rows.append(hospital)
        return rows


def get_websites() -> Dict[HospitalID, str]:
    with open("../data/hospitals.csv") as csvfile:
        reader = csv.DictReader(csvfile)
        websites = {}
        for row in reader:
            hospital_id = row["公費疫苗醫院編號"]
            website = row["Website"]
            websites[hospital_id] = website
        return websites


async def government_paid_hospital_data() -> List[Hospital]:
    should_scrape = app.config["scrape"]
    if should_scrape:
        availability = await local_scraper.get_hospital_availability()
    else:
        availability = get_availability_from_server()
    with open("../data/hospitals.json") as jsonfile:
        blob = json.loads(jsonfile.read())
        rows = []
        websites = get_websites()
        for row in blob:
            hospital_id = row["HospitalId"]
            default_schema: HospitalAvailabilitySchema = {
                "self_paid": AppointmentAvailability.NO_DATA,
                "government_paid": AppointmentAvailability.NO_DATA,
            }
            hospital_availability: HospitalAvailabilitySchema = (
                availability[hospital_id]
                if hospital_id in availability
                else default_schema
            )
            hospital: Hospital = {
                "address": row["Address"],
                "selfPaidAvailability": AppointmentAvailability.UNAVAILABLE,
                "department": "department",
                "governmentPaidAvailability": hospital_availability["government_paid"],
                "hospitalId": row["HospitalId"],
                "location": row["City"],
                "name": row["HospitalName"],
                "phone": row["Phone"],
                "website": (websites[hospital_id] if hospital_id in websites else ''),
            }
            rows.append(hospital)
        return rows


# pyre-fixme[56]: Decorator async types are not type-checked.
@app.route("/self_paid_hospitals")
async def self_paid_hospitals() -> wrappers.Response:
    data = await self_paid_hospital_data()
    response = app.response_class(
        response=json.dumps(data),
        status=200,
        mimetype="application/json",
    )
    return response


# pyre-fixme[56]: Decorator async types are not type-checked.
@app.route("/government_paid_hospitals")
async def government_paid_hospitals() -> wrappers.Response:
    data = await government_paid_hospital_data()
    response = app.response_class(
        response=json.dumps(data),
        status=200,
        mimetype="application/json",
    )
    return response


@app.route("/criteria")
def criteria() -> str:
    return render_template("./index.html")


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
