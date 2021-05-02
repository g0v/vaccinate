from typing import Tuple
import requests
from bs4 import BeautifulSoup
from hospital_types import HospitalID, AppointmentAvailability


def parseMOHWKeelung() -> Tuple[HospitalID, AppointmentAvailability]:
    return parseMOHW(1, "netreg.kln.mohw.gov.tw", "0196")


def parseMOHWTaoyuan() -> Tuple[HospitalID, AppointmentAvailability]:
    return parseMOHW(10, "tyghnetreg.tygh.mohw.gov.tw", "0126")


def parseMOHWMiaoli() -> Tuple[HospitalID, AppointmentAvailability]:
    return parseMOHW(13, "reg2.mil.mohw.gov.tw", "CO23")


def parseMOHWTaichung() -> Tuple[HospitalID, AppointmentAvailability]:
    return parseMOHW(14, "www03.taic.mohw.gov.tw", "01CD")


def parseMOHWTaitung() -> Tuple[HospitalID, AppointmentAvailability]:
    return parseMOHW(28, "netreg01.tait.mohw.gov.tw", "0119")


def parseMOHWKinmen() -> Tuple[HospitalID, AppointmentAvailability]:
    return parseMOHW(29, "netreg.kmhp.mohw.gov.tw", "104A")


def parseMOHW(
    index: int, hostname: str, div_dr: str
) -> Tuple[HospitalID, AppointmentAvailability]:
    available = parseMOHWPage(hostname, div_dr)
    return (
        index,
        AppointmentAvailability.AVAILABLE
        if bool(available)
        else AppointmentAvailability.UNAVAILABLE,
    )


def parseMOHWPage(hostname: str, div_dr: str) -> bool:
    entrypoint_url = (
        "https://{}/OINetReg/OINetReg.Reg/Reg_RegTable.aspx?DivDr={}&Way=Dept".format(
            hostname, div_dr
        )
    )
    regtable_url = "https://{}/OINetReg/OINetReg.Reg/Sub_RegTable.aspx".format(hostname)

    s = requests.session()

    # get session from this page
    s.get(entrypoint_url)

    # request first week of reservations
    r = s.get(regtable_url)

    # if first page shows available reservations, exit early
    if parseMOHWWeekPage(r.text):
        return True

    soup = BeautifulSoup(r.text, "html.parser")

    # get all weeks and states
    inputs = soup.find_all("input")
    states = dict((x["name"], x["value"]) for x in inputs)

    weeks = [x["value"] for x in soup.findAll("input", {"name": "RdBtnLstWeek"})]
    weeks.pop(0)  # popping off the first page

    for week in weeks:
        states["RdBtnLstWeek"] = week
        r = s.post(regtable_url, data=states)
        if parseMOHWWeekPage(r.text):
            return True

    return False


def parseMOHWWeekPage(body: str) -> bool:
    soup = BeautifulSoup(body, "html.parser")

    # get a list of possible days
    lst = [
        y.find_all(text=True)
        for x in soup.find_all("tr")[1:4]
        for y in x.find_all("td")[1:7]
    ]

    # the output of above list comprehension is follows:
    # [[], ["name of doctor", " (reservation count)"], ["name of doctor", "額滿"], ...]
    # the second one shows availability
    lst = [x[1] for x in lst if len(x) != 0 and x[1] != "額滿"]

    return len(lst) != 0
