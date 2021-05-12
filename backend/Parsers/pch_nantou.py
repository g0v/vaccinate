from typing import Tuple
import requests
from bs4 import BeautifulSoup
from hospital_types import (
    AppointmentAvailability,
    ScrapedData,
    HospitalAvailabilitySchema,
)


def parse_pch_nantou() -> ScrapedData:
    r = requests.get(
        "http://web2.pch.org.tw/booking/Covid19Reg/Covid19Reg.aspx?InsType=1",
        timeout=1,
    )
    soup = BeautifulSoup(r.text, "html.parser")
    selector = soup.find("select", {"id": "ddlSchd"})
    options = selector.find_all("option")
    availability: HospitalAvailabilitySchema = {
        "self_paid": AppointmentAvailability.AVAILABLE
        if bool(options)
        else AppointmentAvailability.UNAVAILABLE,
        "government_paid": AppointmentAvailability.NO_DATA,
    }
    # PEP8 Style: if list is not empty, then there are appointments
    return (
        17,
        availability,
    )
