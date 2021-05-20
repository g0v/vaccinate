from typing import Tuple
import requests
from bs4 import BeautifulSoup
from hospital_types import (
    ScrapedData,
    AppointmentAvailability,
    HospitalAvailabilitySchema,
)
from Parsers.Scraper import Scraper
import aiohttp, asyncio


URL: str = "https://register.cgmh.org.tw/Department/6/60990E"


class ChanggungChiayi(Scraper):
    hospital_id = "1140010510"

    async def scrape(self) -> ScrapedData:
        timeout = aiohttp.ClientTimeout(total=5)
        async with aiohttp.ClientSession(timeout=timeout) as session:
            async with session.get(URL) as r:
                return self.parse_changgung_chiayi(await r.text())

    def parse_changgung_chiayi(self, html: str) -> ScrapedData:
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
            self.hospital_id,
            availability,
        )
