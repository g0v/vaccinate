from typing import Tuple, List, Any
import requests
from bs4 import BeautifulSoup
from hospital_types import (
    AppointmentAvailability,
    ScrapedData,
    HospitalAvailabilitySchema,
)
from Parsers.Scraper import Scraper
import asyncio, aiohttp


URL = "https://w3.tyh.com.tw/WebRegList_Dept.aspx?d=55"


class TonyenHsinchu(Scraper):

    hospital_id = "933050018"

    async def scrape(self) -> ScrapedData:
        timeout = aiohttp.ClientTimeout(total=10)
        async with aiohttp.ClientSession(timeout=timeout) as session:
            async with session.get(URL) as r:
                return self.parse_tonyen_hsinchu(await r.text())

    def parse_tonyen_hsinchu(self, r: str) -> ScrapedData:
        soup = BeautifulSoup(r, "html.parser")
        table = soup.find("table", {"class": "today-table"})
        days = table.find_all("td", {"class": "table-day"})
        appointments = list(filter(lambda day: bool(day.find_all("a")), days))
        availability: HospitalAvailabilitySchema = {
            "self_paid": AppointmentAvailability.NO_DATA,
            "government_paid": AppointmentAvailability.NO_DATA,
        }
        # PEP8 Style: if list is not empty, then there are appointments
        return (self.hospital_id, availability)
