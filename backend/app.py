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


class hospitalsLinks(TypedDict):
    title: str
    link: str


class PopupVaccineNews(TypedDict):
    text: str
    buttons: List[Dict[str, str]]


class AirTableRequestParams(TypedDict):
    filterByFormula: Optional[str]
    offset: Optional[str]
    maxRecords: Optional[int]
    view: Optional[str]


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


async def get_popup_news(offset: str = "") -> PopupVaccineNews:
    url_params: AirTableRequestParams = {
        "filterByFormula": "{是否顯示}",
        "maxRecords": 5,
        "offset": offset,
        "view": None,
    }
    api_key: Optional[str] = AIRTABLE_API_KEY
    REQUEST_URL: str = "https://api.airtable.com/v0/appwPM9XFr1SSNjy4/tblTplX7CRnNvFdoQ"
    authorization: Optional[str] = "Bearer " + api_key if api_key is not None else None
    HEADERS: Dict[str, str] = (
        {"Authorization": "Bearer " + api_key} if api_key is not None else {}
    )

    remove_nones = lambda params: {k: v for k, v in params.items() if v is not None}

    timeout = aiohttp.ClientTimeout(total=10)
    async with aiohttp.ClientSession(timeout=timeout) as session:
        async with session.get(
            REQUEST_URL, headers=remove_nones(HEADERS), params=remove_nones(url_params)
        ) as r:
            popup_news_data: Dict[str, Any] = await r.json()
            result: PopupVaccineNews = {"text": "", "buttons": []}
            for record in popup_news_data["records"]:
                if record["fields"]["title"] == "text":
                    result["text"] += record["fields"]["words"]
                else:
                    result["buttons"].append(record["fields"])
            return result


async def get_hospitals_from_airtable(
    offset: str = "", city: str = "臺北市"
) -> List[Hospital]:
    formula: str = f"{{施打站縣市（自動）}}='{city}'"
    url_params: AirTableRequestParams = {
        "filterByFormula": formula,
        "offset": offset,
        "maxRecords": 9999,
        "view": "給前端顯示用的資料",
    }
    # Must make global constant locally scoped to support typechecking for
    # ternary operators for optionals
    api_key: Optional[str] = AIRTABLE_API_KEY
    REQUEST_URL: str = "https://api.airtable.com/v0/appwPM9XFr1SSNjy4/tblJCPWEMpMg86dI8"
    authorization: Optional[str] = "Bearer " + api_key if api_key is not None else None
    HEADERS: Dict[str, Optional[str]] = {"Authorization": authorization}
    timeout = aiohttp.ClientTimeout(total=10)
    return_list: list[Hospital] = []

    remove_nones = lambda params: {k: v for k, v in params.items() if v is not None}

    async with aiohttp.ClientSession(timeout=timeout) as session:
        async with session.get(
            REQUEST_URL, headers=remove_nones(HEADERS), params=remove_nones(url_params)
        ) as r:
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


async def get_hospitals_links(
    offset: str = "", city: str = "臺北市"
) -> Dict[str, List[hospitalsLinks]]:
    formula: str = f"{{縣市（純文字）}}='{city}'"
    url_params: AirTableRequestParams = {
        "filterByFormula": formula,
        "offset": offset,
        "maxRecords": 9999,
        "view": "前端顯示用",
    }
    api_key: Optional[str] = AIRTABLE_API_KEY
    REQUEST_URL: str = "https://api.airtable.com/v0/appwPM9XFr1SSNjy4/%E9%A0%90%E7%B4%84%E9%80%A3%E7%B5%90%E6%B8%85%E5%96%AE"
    authorization: Optional[str] = "Bearer " + api_key if api_key is not None else None
    HEADERS: Dict[str, Optional[str]] = {"Authorization": authorization}
    timeout = aiohttp.ClientTimeout(total=10)
    return_dict: Dict[str, List[hospitalsLinks]] = {}

    remove_nones = lambda params: {k: v for k, v in params.items() if v is not None}

    async with aiohttp.ClientSession(timeout=timeout) as session:
        async with session.get(
            REQUEST_URL, headers=remove_nones(HEADERS), params=remove_nones(url_params)
        ) as r:
            links_json_objects: Dict[str, Any] = await r.json()
            for record in links_json_objects["records"]:
                record = record["fields"]
                primaryKey = record.get("縣市（純文字）") + record.get("施打站全稱（自動）")
                if primaryKey in return_dict:
                    return_dict[primaryKey].append(
                        {
                            "title": record.get("按鈕名稱"),
                            "link": record.get("按鈕連結"),
                        }
                    )
                else:
                    return_dict[primaryKey] = [
                        {
                            "title": record.get("按鈕名稱"),
                            "link": record.get("按鈕連結"),
                        }
                    ]
            if "offset" in links_json_objects:
                next_page_datas = await get_hospitals_links(
                    links_json_objects["offset"]
                )
                for primaryKey, data in next_page_datas.items():
                    if primaryKey in return_dict:
                        return_dict[primaryKey] += data
                    else:
                        return_dict[primaryKey] = data
            return return_dict


def parse_airtable_json_for_hospital(raw_data: Dict[str, Any]) -> Hospital:
    hospital: Hospital = {
        "address": raw_data.get("施打站地址（自動）", "無資料"),
        "selfPaidAvailability": AppointmentAvailability.NO_DATA,
        "department": "",
        "governmentPaidAvailability": AppointmentAvailability.NO_DATA,
        "hospitalId": "0",
        "location": raw_data["施打站縣市（自動）"],
        "district": raw_data.get("施打站行政區（自動）", "無資料"),
        "name": raw_data["施打站全稱（自動）"],
        "phone": raw_data.get("預約電話（自動）", "無資料"),
        "website": raw_data.get("實際預約網址（手動）", raw_data.get("官方提供網址（自動）", None)),
        "lastModified": raw_data.get("Last Modified"),
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


async def government_paid_hospital_data() -> List[Hospital]:
    return await get_hospitals_from_airtable()


# pyre-fixme[56]: Decorator async types are not type-checked.
@app.route("/hospitals_links")
async def hospitals_links() -> wrappers.Response:
    city: str = request.args.get("city")
    data = await get_hospitals_links("", city)
    response = app.response_class(
        response=json.dumps(data),
        status=200,
        mimetype="application/json",
    )
    return response


# pyre-fixme[56]: Decorator async types are not type-checked.
@app.route("/government_paid_hospitals")
async def government_paid_hospitals() -> wrappers.Response:
    city: str = request.args.get("city")
    data = await get_hospitals_from_airtable("", city)
    response = app.response_class(
        response=json.dumps(data),
        status=200,
        mimetype="application/json",
    )
    return response


# pyre-fixme[56]: Decorator async types are not type-checked.
@app.route("/popup_news")
async def popup_news() -> wrappers.Response:
    data = await get_popup_news()
    response = app.response_class(
        response=json.dumps(data),
        status=200,
        mimetype="application/json",
    )
    return response


@app.route("/about")
@app.route("/criteria")
@app.route("/credits")
@app.route("/")
def index() -> str:
    return render_template("./index.html")


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0")
