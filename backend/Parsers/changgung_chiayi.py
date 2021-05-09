from typing import Tuple
import requests
from bs4 import BeautifulSoup
from hospital_types import HospitalID, AppointmentAvailability


def parse_changgung_chiayi() -> Tuple[HospitalID, AppointmentAvailability]:
    r = requests.get(
        "https://register.cgmh.org.tw/Department/6/60990E",
        timeout=1,
    )
    soup = BeautifulSoup(r.text, "html.parser")
    table = soup.find("table", {"class": "department-table"})
    links = table.find_all("a")
    # PEP8 Style: if list is not empty, then there are appointments
    return (
        21,
        AppointmentAvailability.AVAILABLE
        if bool(links)
        else AppointmentAvailability.UNAVAILABLE,
    )
