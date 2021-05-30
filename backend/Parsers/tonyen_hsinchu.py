from hospital_types import (
    AppointmentAvailability,
    ScrapedData,
    HospitalAvailabilitySchema,
)
from Parsers.Scraper import Scraper
import aiohttp


URL = "https://w3.tyh.com.tw/WebRegList_Dept.aspx?d=55"


class TonyenHsinchu(Scraper):

    hospital_id = "0933050018"

    async def scrape(self) -> ScrapedData:
        timeout = aiohttp.ClientTimeout(total=10)
        async with aiohttp.ClientSession(timeout=timeout) as session:
            async with session.get(URL) as r:
                return self.parse_tonyen_hsinchu(await r.text())

    # TODO: Fix this parser.
    def parse_tonyen_hsinchu(self, r: str) -> ScrapedData:
        availability: HospitalAvailabilitySchema = {
            "self_paid": AppointmentAvailability.NO_DATA,
            "government_paid": AppointmentAvailability.NO_DATA,
        }
        # PEP8 Style: if list is not empty, then there are appointments
        return (self.hospital_id, availability)
