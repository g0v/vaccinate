from typing import Tuple
import requests
from bs4 import BeautifulSoup
from hospital_types import (
    ScrapedData,
    AppointmentAvailability,
    HospitalAvailabilitySchema,
)


def parse_changgung_chiayi() -> ScrapedData:
    r = requests.get(
        "https://register.cgmh.org.tw/Department/6/60990E",
        timeout=1,
    )
    soup = BeautifulSoup(r.text, "html.parser")
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
