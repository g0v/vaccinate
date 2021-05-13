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


def parse_ntu(
    hospital_id: HospitalID, self_paid_url: str, gov_paid_url: str
) -> ScrapedData:
    availability: HospitalAvailabilitySchema = {
        "self_paid": parse_ntu_self_paid(self_paid_url),
        "government_paid": parse_ntu_gov_paid(gov_paid_url),
    }
    # PEP8 Style: if list is not empty, then there are appointments
    return (
        hospital_id,
        availability,
    )


def parse_ntu_self_paid(url: str) -> AppointmentAvailability:
    r = requests.get(
        url,
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


def parse_ntu_gov_paid(url: str) -> AppointmentAvailability:
    r = requests.get(
        url,
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


SELF_PAID_YUNLIN: str = "https://reg.ntuh.gov.tw/WebAdministration/DoctorServiceQueryByDrName.aspx?HospCode=Y0&QueryName=%E4%B8%BB%E6%B2%BB%E9%86%AB%E5%B8%AB"
GOV_PAID_YUNLIN: str = (
    "https://reg.ntuh.gov.tw/WebAdministration/VaccineClinicReg.aspx?Hosp=Y0&Reg="
)


def parse_ntu_yunlin() -> ScrapedData:
    return parse_ntu(19, SELF_PAID_YUNLIN, GOV_PAID_YUNLIN)


SELF_PAID_HSINCHU: str = "https://reg.ntuh.gov.tw/WebAdministration/VaccineRegPublic.aspx?Hosp=T4&RegionCode="
GOV_PAID_HSINCHU: str = (
    "https://reg.ntuh.gov.tw/WebAdministration/VaccineClinicReg.aspx?Hosp=T4&Reg="
)


def parse_ntu_hsinchu() -> ScrapedData:
    return parse_ntu(11, SELF_PAID_HSINCHU, GOV_PAID_HSINCHU)


SELF_PAID_TAIPEI: str = (
    "https://reg.ntuh.gov.tw/WebAdministration/VaccineRegPublic.aspx?Hosp=T0&Reg="
)
GOV_PAID_TAIPEI: str = (
    "https://reg.ntuh.gov.tw/WebAdministration/VaccineClinicReg.aspx?Hosp=T0&Reg="
)


def parse_ntu_taipei() -> ScrapedData:
    return parse_ntu(3, SELF_PAID_TAIPEI, GOV_PAID_TAIPEI)
