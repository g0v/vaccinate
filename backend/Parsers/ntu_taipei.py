from typing import Tuple
import requests
from bs4 import BeautifulSoup
from hospital_types import HospitalID, AppointmentAvailability


def parseNTUH() -> Tuple[HospitalID, AppointmentAvailability]:
    r = requests.get(
        "https://reg.ntuh.gov.tw/WebAdministration/VaccineRegPublic.aspx?Hosp=T0&Reg=",
        verify="../data/ntuh-gov-tw-chain.pem",
        timeout=2,
    )
    soup = BeautifulSoup(r.text, "html.parser")
    table = soup.find("table")
    links = table.find_all("a", string="掛號")
    # PEP8 Style: if list is not empty, then there are appointments
    return (
        3,
        AppointmentAvailability.AVAILABLE
        if bool(links)
        else AppointmentAvailability.UNAVAILABLE,
    )
