from typing import Tuple, List, Any, Coroutine
from bs4 import BeautifulSoup
from hospital_types import (
    AppointmentAvailability,
    ScrapedData,
    HospitalAvailabilitySchema,
)
import asyncio, aiohttp
import ssl

URL: str = (
    "https://reg-prod.tzuchi-healthcare.org.tw/tchw/HIS5OpdReg/OpdTimeShow?Pass=XD;0022"
)


async def parse_tzuchi_taipei() -> ScrapedData:
    sslcontext = ssl.create_default_context(
        cafile="../data/tzuchi-healthcare-org-tw-chain.pem"
    )
    async with aiohttp.ClientSession() as session:
        async with session.get(URL) as r:
            print(await r.text())
            soup = BeautifulSoup(await r.text(), "html.parser")
            table = soup.find("table", {"id": "MainContent_gvOpdList"})
            rows = table.find_all("tr", {"class": "OpdListD"})
            rows = list(filter(row_contains_appointment, rows))
            availability: HospitalAvailabilitySchema = {
                "self_paid": AppointmentAvailability.AVAILABLE
                if bool(rows)
                else AppointmentAvailability.UNAVAILABLE,
                "government_paid": AppointmentAvailability.NO_DATA,
            }
            # PEP8 Style: if list is not empty, then there are appointments
            return (
                8,
                availability,
            )


def row_contains_appointment(row: BeautifulSoup) -> bool:
    columns = row.find_all("td")
    column_two_has_appointment = bool(columns[1].find_all("a"))
    column_three_has_appointment = bool(columns[2].find_all("a"))
    return column_two_has_appointment or column_three_has_appointment
