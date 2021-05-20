from typing import Tuple, List, Any, Coroutine
from bs4 import BeautifulSoup
from hospital_types import (
    AppointmentAvailability,
    ScrapedData,
    HospitalAvailabilitySchema,
)
from Parsers.Scraper import Scraper
import asyncio, aiohttp
import ssl

URL: str = (
    "https://reg-prod.tzuchi-healthcare.org.tw/tchw/HIS5OpdReg/OpdTimeShow?Pass=XD;0022"
)


class TzuchiTaipei(Scraper):

    hospital_id = "1131050515"

    async def scrape(self) -> ScrapedData:
        sslcontext = ssl.create_default_context(
            cafile="../data/tzuchi-healthcare-org-tw-chain.pem"
        )
        timeout = aiohttp.ClientTimeout(total=5)
        async with aiohttp.ClientSession(timeout=timeout) as session:
            async with session.get(URL, ssl=sslcontext) as r:
                soup = BeautifulSoup(await r.text(), "html.parser")
                table = soup.find("table", {"id": "MainContent_gvOpdList"})
                rows = table.find_all("tr", {"class": "OpdListD"})
                rows = list(filter(self.row_contains_appointment, rows))
                availability: HospitalAvailabilitySchema = {
                    "self_paid": AppointmentAvailability.AVAILABLE
                    if bool(rows)
                    else AppointmentAvailability.UNAVAILABLE,
                    "government_paid": AppointmentAvailability.NO_DATA,
                }
                # PEP8 Style: if list is not empty, then there are appointments
                return (
                    self.hospital_id,
                    availability,
                )

    def row_contains_appointment(self, row: BeautifulSoup) -> bool:
        columns = row.find_all("td")
        column_two_has_appointment = bool(columns[1].find_all("a"))
        column_three_has_appointment = bool(columns[2].find_all("a"))
        return column_two_has_appointment or column_three_has_appointment
