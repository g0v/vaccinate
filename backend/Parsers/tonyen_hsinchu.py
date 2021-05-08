from typing import Tuple, List, Any
import requests
from bs4 import BeautifulSoup
from hospital_types import AppointmentAvailability, ScrapedData


def parseTonyenHsinchu() -> Tuple[int, AppointmentAvailability]:
    r = requests.get(
        "https://w3.tyh.com.tw/WebRegList_Dept.aspx?d=55",
        timeout=2,
    )
    soup = BeautifulSoup(r.text, "html.parser")
    table = soup.find("table", {"class": "today-table"})
    days = table.find_all("td", {"class": "table-day"})
    appointments = list(filter(lambda day: bool(day.find_all("a")), days))
    # PEP8 Style: if list is not empty, then there are appointments
    return (
        12,
        AppointmentAvailability.AVAILABLE
        if bool(appointments)
        else AppointmentAvailability.UNAVAILABLE,
    )
