from typing import Tuple
import requests
from bs4 import BeautifulSoup
from hospital_types import (
    HospitalID,
    AppointmentAvailability,
    HospitalAvailabilitySchema,
    ScrapedData,
)

CERT: str = "../data/ntuh-gov-tw-chain.pem"


def parse_ntu_yunlin() -> ScrapedData:
    availability: HospitalAvailabilitySchema = {
        "self_paid": parse_ntu_yunlin_self_paid(),
        "government_paid": parse_ntu_yunlin_gov_paid(),
    }
    # PEP8 Style: if list is not empty, then there are appointments
    return (
        19,
        availability,
    )


def parse_ntu_yunlin_self_paid() -> AppointmentAvailability:
    r = requests.get(
        "https://reg.ntuh.gov.tw/WebAdministration/DoctorServiceQueryByDrName.aspx?HospCode=Y0&QueryName=%E4%B8%BB%E6%B2%BB%E9%86%AB%E5%B8%AB",
        verify=CERT,
        timeout=2,
    )
    soup = BeautifulSoup(r.text, "html.parser")
    table = soup.find("table")
    links = table.find_all("a", string="掛號")
    return (
        AppointmentAvailability.AVAILABLE
        if bool(links)
        else AppointmentAvailability.UNAVAILABLE
    )


def parse_ntu_yunlin_gov_paid() -> AppointmentAvailability:
    r = requests.get(
        "https://reg.ntuh.gov.tw/WebAdministration/VaccineClinicReg.aspx?Hosp=Y0&Reg=",
        verify=CERT,
        timeout=2,
    )
    soup = BeautifulSoup(r.text, "html.parser")
    radio_buttons = soup.find("span", {"id": "rbl_Clinic"})
    appointments = radio_buttons.find_all("input")
    appointments = list(filter(lambda tag: not tag.has_attr("disabled"), appointments))
    return (
        AppointmentAvailability.AVAILABLE
        if bool(appointments)
        else AppointmentAvailability.UNAVAILABLE
    )
