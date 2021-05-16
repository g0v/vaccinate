from typing import Tuple
import requests
from bs4 import BeautifulSoup
from hospital_types import (
    ScrapedData,
    AppointmentAvailability,
    HospitalAvailabilitySchema,
)
import aiohttp, asyncio


URL: str = "http://netreg.afph.tsgh.ndmctsgh.edu.tw/webreg/calendar_type/5xn1z9fPG5H4JDJEV98dHQ%3D%3D"


async def scrape_sanjunzong_penghu() -> ScrapedData:
    timeout = aiohttp.ClientTimeout(total=5)
    async with aiohttp.ClientSession(timeout=timeout) as session:
        async with session.get(URL) as r:
            return parse_sanjunzong_penghu(await r.text())


def parse_sanjunzong_penghu(html: str) -> ScrapedData:
    soup = BeautifulSoup(html, "html.parser")
    weekly_tables = soup.find("table", {"id": "timeTable"}).find_all("tbody")
    available_links = []
    for table in weekly_tables:
        links = table.find_all("a")
        available_links = available_links + links
    availability: HospitalAvailabilitySchema = {
        "self_paid": AppointmentAvailability.AVAILABLE
        if available_links
        else AppointmentAvailability.UNAVAILABLE,
        "government_paid": AppointmentAvailability.NO_DATA,
    }
    return (
        31,
        availability,
    )
