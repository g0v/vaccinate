from typing import Tuple, List, Any
import requests
from bs4 import BeautifulSoup
from hospital_types import (
    AppointmentAvailability,
    ScrapedData,
    HospitalAvailabilitySchema,
)
import asyncio, aiohttp


URL = "https://w3.tyh.com.tw/WebRegList_Dept.aspx?d=55"


async def scrape_tonyen_hsinchu() -> ScrapedData:
    timeout = aiohttp.ClientTimeout(total=10)
    async with aiohttp.ClientSession(timeout=timeout) as session:
        async with session.get(URL) as r:
            return parse_tonyen_hsinchu(await r.text())


def parse_tonyen_hsinchu(r: str) -> ScrapedData:
    soup = BeautifulSoup(r, "html.parser")
    table = soup.find("table", {"class": "today-table"})
    days = table.find_all("td", {"class": "table-day"})
    appointments = list(filter(lambda day: bool(day.find_all("a")), days))
    availability: HospitalAvailabilitySchema = {
        "self_paid": AppointmentAvailability.AVAILABLE
        if bool(appointments)
        else AppointmentAvailability.UNAVAILABLE,
        "government_paid": AppointmentAvailability.NO_DATA,
    }
    # PEP8 Style: if list is not empty, then there are appointments
    return (12, availability)
