from bs4 import BeautifulSoup
from hospital_types import (
    ScrapedData,
    AppointmentAvailability,
    HospitalAvailabilitySchema,
)
from Parsers.Scraper import Scraper
import aiohttp


URL: str = "http://netreg.afph.tsgh.ndmctsgh.edu.tw/webreg/calendar_type/5xn1z9fPG5H4JDJEV98dHQ%3D%3D"


class SanjunzongPenghu(Scraper):

    hospital_id = "0544010031"

    async def scrape(self) -> ScrapedData:
        timeout = aiohttp.ClientTimeout(total=5)
        async with aiohttp.ClientSession(timeout=timeout) as session:
            async with session.get(URL) as r:
                return self.parse_sanjunzong_penghu(await r.text())

    def parse_sanjunzong_penghu(self, html: str) -> ScrapedData:
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
            self.hospital_id,
            availability,
        )
