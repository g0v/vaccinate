from typing import Tuple
import requests
from bs4 import BeautifulSoup
from hospital_types import (
    HospitalID,
    AppointmentAvailability,
    ScrapedData,
    HospitalAvailabilitySchema,
)
import aiohttp


URL: str = "https://www.kmsh.org.tw/web/BookVaccineSysInter"


async def scrape_siaogang_kaohsiung() -> ScrapedData:
    timeout = aiohttp.ClientTimeout(total=5)
    async with aiohttp.ClientSession(timeout=timeout) as session:
        async with session.get(URL) as r:
            return parse_siaogang_kaohsiung(await r.text())


def parse_siaogang_kaohsiung(raw_html: str) -> ScrapedData:
    def has_no_appointments(option: BeautifulSoup) -> bool:
        option = option.text
        return int(option[option.find("數") + 2 :].split("-")[0]) == 0

    soup = BeautifulSoup(raw_html, "html.parser")
    select = soup.find("select", {"id": "InputBookDate"})
    options = select.find_all("option")
    options = list(filter(has_no_appointments, options))

    availability: HospitalAvailabilitySchema = {
        # TODO: Fix this parser.
        "self_paid": AppointmentAvailability.NO_DATA,
        "government_paid": AppointmentAvailability.NO_DATA,
    }

    # PEP8 Style: if list is not empty, then there are appointments
    return (
        "1102110011",
        availability,
    )
