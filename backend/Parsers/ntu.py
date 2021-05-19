from typing import Tuple
import requests
from bs4 import BeautifulSoup
from hospital_types import (
    HospitalID,
    AppointmentAvailability,
    HospitalAvailabilitySchema,
    ScrapedData,
)
import aiohttp, ssl

CERT: str = "../data/ntuh-gov-tw-chain.pem"


async def parse_ntu(
    hospital_id: HospitalID, self_paid_url: str, gov_paid_url: str
) -> ScrapedData:
    availability: HospitalAvailabilitySchema = {
        "self_paid": await parse_ntu_self_paid(self_paid_url),
        "government_paid": await parse_ntu_gov_paid(gov_paid_url),
    }
    # PEP8 Style: if list is not empty, then there are appointments
    return (
        hospital_id,
        availability,
    )


async def parse_ntu_self_paid(url: str) -> AppointmentAvailability:
    sslcontext = ssl.create_default_context(cafile=CERT)
    timeout = aiohttp.ClientTimeout(total=10)
    async with aiohttp.ClientSession(timeout=timeout) as session:
        async with session.get(url, ssl=sslcontext) as r:
            soup = BeautifulSoup(await r.text(), "html.parser")
            table = soup.find("table")
            links = table.find_all("a", string="掛號")
            return (
                AppointmentAvailability.AVAILABLE
                if bool(links)
                else AppointmentAvailability.UNAVAILABLE
            )


async def parse_ntu_gov_paid(url: str) -> AppointmentAvailability:
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


SELF_PAID_YUNLIN: str = (
    "https://reg.ntuh.gov.tw/WebAdministration/VaccineRegPublic.aspx?Hosp=Y0&Reg="
)
GOV_PAID_YUNLIN: str = (
    "https://reg.ntuh.gov.tw/WebAdministration/VaccineClinicReg.aspx?Hosp=Y0&Reg="
)


async def parse_ntu_yunlin() -> ScrapedData:
    return await parse_ntu("0439010518a", SELF_PAID_YUNLIN, GOV_PAID_YUNLIN)


SELF_PAID_HSINCHU: str = "https://reg.ntuh.gov.tw/WebAdministration/VaccineRegPublic.aspx?Hosp=T4&RegionCode="
GOV_PAID_HSINCHU: str = (
    "https://reg.ntuh.gov.tw/WebAdministration/VaccineClinicReg.aspx?Hosp=T4&Reg="
)


async def parse_ntu_hsinchu() -> ScrapedData:
    return await parse_ntu("412040012", SELF_PAID_HSINCHU, GOV_PAID_HSINCHU)


SELF_PAID_TAIPEI: str = (
    "https://reg.ntuh.gov.tw/WebAdministration/VaccineRegPublic.aspx?Hosp=T0&Reg="
)
GOV_PAID_TAIPEI: str = (
    "https://reg.ntuh.gov.tw/WebAdministration/VaccineClinicReg.aspx?Hosp=T0&Reg="
)


async def parse_ntu_taipei() -> ScrapedData:
    return await parse_ntu("401180014", SELF_PAID_TAIPEI, GOV_PAID_TAIPEI)
