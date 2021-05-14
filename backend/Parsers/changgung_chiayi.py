from typing import Tuple
import requests
from bs4 import BeautifulSoup
from hospital_types import (
    ScrapedData,
    AppointmentAvailability,
    HospitalAvailabilitySchema,
)
import aiohttp, asyncio


URL: str = "https://register.cgmh.org.tw/Department/6/60990E"


async def scrape_changgung_chiayi() -> ScrapedData:
    timeout = aiohttp.ClientTimeout(total=2)
    async with aiohttp.ClientSession(timeout=timeout) as session:
        async with session.get(URL) as r:
            return parse_changgung_chiayi(await r.text())


def parse_changgung_chiayi(html: str) -> ScrapedData:
    soup = BeautifulSoup(html, "html.parser")
    table = soup.find("table", {"class": "department-table"})
    links = table.find_all("a")
    full_links = table.find_all("a", {"class": "state-full"})
    availability: HospitalAvailabilitySchema = {
        "self_paid": AppointmentAvailability.AVAILABLE
        if len(links) > len(full_links)
        else AppointmentAvailability.UNAVAILABLE,
        "government_paid": AppointmentAvailability.NO_DATA,
    }
    # PEP8 Style: if list is not empty, then there are appointments
    return (
        21,
        availability,
    )
