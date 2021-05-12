from typing import Tuple
import requests
from bs4 import BeautifulSoup
from hospital_types import (
    HospitalID,
    AppointmentAvailability,
    HospitalAvailabilitySchema,
    ScrapedData,
)


def parse_ntu_yunlin() -> ScrapedData:
    r = requests.get(
        "https://reg.ntuh.gov.tw/WebAdministration/DoctorServiceQueryByDrName.aspx?HospCode=Y0&QueryName=%E4%B8%BB%E6%B2%BB%E9%86%AB%E5%B8%AB",
        verify="../data/ntuh-gov-tw-chain.pem",
        timeout=2,
    )
    soup = BeautifulSoup(r.text, "html.parser")
    table = soup.find("table")
    links = table.find_all("a", string="掛號")
    availability: HospitalAvailabilitySchema = {
        "self_paid": AppointmentAvailability.AVAILABLE
        if bool(links)
        else AppointmentAvailability.UNAVAILABLE,
        "government_paid": AppointmentAvailability.NO_DATA,
    }
    # PEP8 Style: if list is not empty, then there are appointments
    return (
        19,
        availability,
    )
