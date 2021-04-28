from typing import Tuple
import requests
from bs4 import BeautifulSoup
from hospital_types import HospitalID, AppointmentAvailability


def parseNTUHHsinchu() -> Tuple[HospitalID, AppointmentAvailability]:
    r = requests.get(
        "https://reg.ntuh.gov.tw/WebAdministration/VaccineRegPublic.aspx?Hosp=T4&RegionCode=",
        verify="data/ntuh-gov-tw-chain.pem",
    )
    soup = BeautifulSoup(r.text, "html.parser")
    table = soup.find("table")
    links = table.find_all("a", string="掛號")
    # PEP8 Style: if list is not empty, then there are appointments
    return (
        11,
        AppointmentAvailability.AVAILABLE
        if bool(links)
        else AppointmentAvailability.UNAVAILABLE,
    )
