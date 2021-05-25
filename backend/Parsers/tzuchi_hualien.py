from bs4 import BeautifulSoup
from hospital_types import (
    AppointmentAvailability,
    ScrapedData,
    HospitalAvailabilitySchema,
)
from Parsers.Scraper import Scraper
import aiohttp

URL = "https://app.tzuchi.com.tw/tchw/opdreg/OpdTimeShow.aspx?Depart=%E8%87%AA%E8%B2%BBCOVID19%E7%96%AB%E8%8B%97%E9%A0%90%E7%B4%84&HospLoc=3"


class TzuchiHualien(Scraper):

    hospital_id = "01145010010"

    async def scrape(self) -> ScrapedData:
        timeout = aiohttp.ClientTimeout(total=2)
        async with aiohttp.ClientSession(timeout=timeout) as session:
            async with session.get(URL) as r:
                soup = BeautifulSoup(await r.text(), "html.parser")
                table = soup.find("table", {"id": "example"})
                links = table.find_all("a")
                availability: HospitalAvailabilitySchema = {
                    "self_paid": AppointmentAvailability.AVAILABLE
                    if bool(links)
                    else AppointmentAvailability.UNAVAILABLE,
                    "government_paid": AppointmentAvailability.NO_DATA,
                }
                # PEP8 Style: if list is not empty, then there are appointments
                return (
                    self.hospital_id,
                    availability,
                )
