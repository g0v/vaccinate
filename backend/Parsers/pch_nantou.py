from typing import Tuple
import requests
from bs4 import BeautifulSoup
from hospital_types import (
    AppointmentAvailability,
    ScrapedData,
    HospitalAvailabilitySchema,
)
import aiohttp


URL: str = "http://web2.pch.org.tw/booking/Covid19Reg/Covid19Reg.aspx?InsType=1"


async def scrape_pch_nantou() -> ScrapedData:
    timeout = aiohttp.ClientTimeout(total=5)
    async with aiohttp.ClientSession(timeout=timeout) as session:
        async with session.get(URL) as r:
            return parse_pch_nantou(await r.text())


def parse_pch_nantou(raw_html: str) -> ScrapedData:
    soup = BeautifulSoup(raw_html, "html.parser")
    selector = soup.find("select", {"id": "ddlSchd"})
    options = selector.find_all("option")
    options = list(filter(lambda o: o.text[-3:-1] != "額滿", options))
    availability: HospitalAvailabilitySchema = {
        "self_paid": AppointmentAvailability.AVAILABLE
        if bool(options)
        else AppointmentAvailability.UNAVAILABLE,
        "government_paid": AppointmentAvailability.NO_DATA,
    }
    # PEP8 Style: if list is not empty, then there are appointments
    return (
        17,
        availability,
    )
