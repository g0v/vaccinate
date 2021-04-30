from typing import Tuple
import requests
from bs4 import BeautifulSoup
from hospital_types import HospitalID, AppointmentAvailability


def parseTzuchiHualien() -> Tuple[HospitalID, AppointmentAvailability]:
    r = requests.get(
        "https://app.tzuchi.com.tw/tchw/opdreg/OpdTimeShow.aspx?Depart=%E8%87%AA%E8%B2%BBCOVID19%E7%96%AB%E8%8B%97%E9%A0%90%E7%B4%84&HospLoc=3",
        timeout=1,
    )
    soup = BeautifulSoup(r.text, "html.parser")
    table = soup.find("table", {'id': 'example'})
    links = table.find_all("a")
    # PEP8 Style: if list is not empty, then there are appointments
    return (
        27,
        AppointmentAvailability.AVAILABLE
        if bool(links)
        else AppointmentAvailability.UNAVAILABLE,
    )
