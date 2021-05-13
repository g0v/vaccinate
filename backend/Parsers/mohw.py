from typing import Tuple
import requests
from bs4 import BeautifulSoup
from hospital_types import HospitalID, AppointmentAvailability


def parseMOHWKeelung() -> Tuple[HospitalID, AppointmentAvailability]:
    return parseMOHW(1, "netreg.kln.mohw.gov.tw", "0196")


def parseMOHWTaoyuan() -> Tuple[HospitalID, AppointmentAvailability]:
    return parseMOHW(10, "tyghnetreg.tygh.mohw.gov.tw", "0126")


def parseMOHWMiaoli() -> Tuple[HospitalID, AppointmentAvailability]:
    index = 13
    available = (
        parseMOHWPage("reg2.mil.mohw.gov.tw", "CO23")
        or parseMOHWPage("reg2.mil.mohw.gov.tw", "CO11")
        or parseMOHWPage("reg2.mil.mohw.gov.tw", "CO41")
    )

    # FIXME(medicalwei): maybe refactor AppointmentAvailability into a function?
    return (
        index,
        AppointmentAvailability.AVAILABLE
        if bool(available)
        else AppointmentAvailability.UNAVAILABLE,
    )


def parseMOHWTaichung() -> Tuple[HospitalID, AppointmentAvailability]:
    return parseMOHW(14, "www03.taic.mohw.gov.tw", "01CD")


def parseMOHWNantou() -> Tuple[HospitalID, AppointmentAvailability]:
    return parseMOHW(18, "netreg01.nant.mohw.gov.tw", "0220")


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

    weeks = [x["value"] for x in soup.find_all("input", {"name": "RdBtnLstWeek"})]

    try:
        weeks.pop(0)  # popping off the first page
    except IndexError:
        # the size of weeks might be zero, e.g. in Miaoli MOHW hospital the
        # reservation calendar is not paged
        return False

    for week in weeks:
        states["RdBtnLstWeek"] = week
        r = s.post(regtable_url, data=states)
        if parseMOHWWeekPage(r.text):
            return True

    return False


def parseMOHWWeekPage(body: str) -> bool:
    soup = BeautifulSoup(body, "html.parser")

    # return if there's any link found in the page
    result = [x for x in soup.find_all("a") if x.text != ""]
    return bool(result)
