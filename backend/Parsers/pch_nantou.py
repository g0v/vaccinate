from typing import Tuple
import requests
from bs4 import BeautifulSoup
from hospital_types import AppointmentAvailability


def parsePchNantou() -> Tuple[int, AppointmentAvailability]:
    r = requests.get(
        "http://web2.pch.org.tw/booking/Covid19Reg/Covid19Reg.aspx?InsType=1",
        timeout=1,
    )
    soup = BeautifulSoup(r.text, "html.parser")
    selector = soup.find("select", {"id": "ddlSchd"})
    options = selector.find_all("option")
    # PEP8 Style: if list is not empty, then there are appointments
    return (
        17,
        AppointmentAvailability.AVAILABLE
        if bool(options)
        else AppointmentAvailability.UNAVAILABLE,
    )
