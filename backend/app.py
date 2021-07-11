from flask import (
    Flask,
    render_template,
    json,
    wrappers,
    request,
    jsonify,
    make_response,
)

from flask_cors import CORS

import argparse
import redis, csv, sys, os
from typing import TypedDict, Tuple, Dict, Callable, List, Any, Optional
from enum import Enum
import requests
from bs4 import BeautifulSoup
import aiohttp, asyncio

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
# TODO: Implement better system for handling API Keys
API_KEY: Optional[str] = os.environ.get("API_KEY")
AIRTABLE_API_KEY: Optional[str] = os.environ.get("AIRTABLE_API_KEY")

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


async def get_hospitals_from_airtable(offset: str = "") -> List[Hospital]:
    # Must make global constant locally scoped to support typechecking for
    # ternary operators for optionals
    api_key: Optional[str] = AIRTABLE_API_KEY
    REQUEST_URL: str = "https://api.airtable.com/v0/appwPM9XFr1SSNjy4/%E6%96%BD%E6%89%93%E9%BB%9E%E6%B8%85%E5%96%AE?maxRecords=1000&view=raw%20data"
    if len(offset) > 0:
        REQUEST_URL += f"&offset={offset}"
    HEADERS: Dict[str, str] = (
        {"Authorization": "Bearer " + api_key} if api_key is not None else {}
    )
    timeout = aiohttp.ClientTimeout(total=10)
    return_list: list[Hospital] = []
    async with aiohttp.ClientSession(timeout=timeout) as session:
        async with session.get(REQUEST_URL, headers=HEADERS) as r:
            hospital_json_objects: Dict[str, Any] = await r.json()
            return_list = list(
                map(
                    lambda raw_data: parse_airtable_json_for_hospital(
                        raw_data["fields"]
                    ),
                    hospital_json_objects["records"],
                )
            )
            if "offset" in hospital_json_objects:
                return return_list + await get_hospitals_from_airtable(
                    hospital_json_objects["offset"]
                )
            else:
                return return_list


def parse_airtable_json_for_hospital(raw_data: Dict[str, Any]) -> Hospital:
    if raw_data.get("實際預約網址（手動）", None) is not None:
        raw_data["官方提供網址（自動）"] = raw_data["實際預約網址（手動）"]
    hospital: Hospital = {
        "address": raw_data["施打站地址（自動）"],
        "selfPaidAvailability": AppointmentAvailability.NO_DATA,
        "department": "",
        "governmentPaidAvailability": AppointmentAvailability.NO_DATA,
        "hospitalId": "0",
        "location": raw_data["施打站縣市（自動）"],
        "name": raw_data["施打站全稱（自動）"],
        "phone": raw_data["預約電話（自動）"],
        "website": raw_data["官方提供網址（自動）"],
    }
    return hospital


app = Flask(
    __name__,
    static_url_path="",
    static_folder="../dist",
    template_folder="../dist",
)

# XXX: Allowing CORS for all endpoints from any origins may introduce problems
# in the future. Consider limiting endpoints to API resouces only.
# Currently limited to semanticly read-only verbs.
CORS(app, resources={r"/*": {"origins": "*", "methods": ["GET", "HEAD", "OPTIONS"]}})


def get_availability_from_server() -> Dict[HospitalID, HospitalAvailabilitySchema]:

    scraper_hospital_ids = list(map(lambda x: x.hospital_id, local_scraper.PARSERS))
    print(scraper_hospital_ids)

    def get_availability(
        hospital_id: HospitalID,
    ) -> ScrapedData:
        raw_availability = r.hgetall("hospital_schema_4:" + str(hospital_id))

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
    return await get_hospitals_from_airtable()


async def government_paid_hospital_data() -> List[Hospital]:
    return await get_hospitals_from_airtable()


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


@app.route("/hospital", methods=["POST"])
def update_hospital() -> wrappers.Response:
    data = request.get_json()
    api_key_from_request = data["api_key"]
    if api_key_from_request != API_KEY:
        return make_response(jsonify({"success": False}), 401)

    hospital_id = data["hospital_id"]
    availability = data["availability"]
    # TODO: Request validation
    r.hset(
        "hospital_schema_4:" + hospital_id, key=None, value=None, mapping=availability
    )
    print(availability)
    return make_response(jsonify({"success": True}), 200)


@app.route("/about")
@app.route("/criteria")
@app.route("/credits")
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
