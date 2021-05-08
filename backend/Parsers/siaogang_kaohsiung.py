from typing import Tuple
import requests
from bs4 import BeautifulSoup
from hospital_types import HospitalID, AppointmentAvailability


def parseSiaogangKaohsiung() -> Tuple[HospitalID, AppointmentAvailability]:
    def has_no_appointments(option: str) -> bool:
        return int(option[18:].split("-")[0]) == 0

    r = requests.get(
        "https://www.kmsh.org.tw/web/BookVaccineSysInter",
        timeout=2,
    )
    soup = BeautifulSoup(r.text, "html.parser")
    select = soup.find("select", {"id": "InputBookDate"})
    options = select.find_all("option")
    options = filter(has_no_appointments, options)

    # PEP8 Style: if list is not empty, then there are appointments
    return (
        23,
        AppointmentAvailability.AVAILABLE
        if bool(options)
        else AppointmentAvailability.UNAVAILABLE,
    )
