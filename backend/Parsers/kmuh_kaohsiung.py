from typing import Tuple, List
import requests
import bs4
from hospital_types import (
    HospitalID,
    AppointmentAvailability,
    HospitalAvailabilitySchema,
    ScrapedData,
)
import ssl, aiohttp


CERT: str = "../data/reg-kmuh-gov-tw-chain.pem"
URL = "https://reg.kmuh.gov.tw/netReg/MainUI.aspx?DeptCodeId=1A&Lang=&RoomCnt=2&TimeRange=1&Name=%E6%96%B0%E5%86%A0%E8%82%BA%E7%82%8E%E7%96%AB%E8%8B%97"


async def parse_kmuh_kaohsiung() -> ScrapedData:
    appointments = await check_available_kmuh_kaohsiung(URL)
    availability: HospitalAvailabilitySchema = {
        "self_paid": AppointmentAvailability.AVAILABLE
        if appointments[0]
        else AppointmentAvailability.UNAVAILABLE,
        "government_paid": AppointmentAvailability.AVAILABLE
        if appointments[1]
        else AppointmentAvailability.UNAVAILABLE,
    }
    return (
        24,
        availability,
    )


async def check_available_kmuh_kaohsiung(url: str) -> List[bool]:
    # Initial data_dict for POST method later.
    post_data = {
        "__EVENTTARGET": "ctl00$MainContent$ddlWeeks",
        "__EVENTARGUMENT": "",
        "__LASTFOCUS": "",
        "__VIEWSTATE": "",
        "__EVENTVALIDATION": "",
        "ctl00$MainContent$ddlWeeks": "",
    }
    # Initial return variable 'appointments'
    appointments = [False, False]

    sslcontext = ssl.create_default_context(cafile=CERT)
    timeout = aiohttp.ClientTimeout(total=5)
    async with aiohttp.ClientSession(timeout=timeout) as session:

        # First request is GET.
        r = await session.get(url, timeout=5)
        raw_html = await r.text()
        soup = bs4.BeautifulSoup(raw_html, "html.parser")

        # Get first day of each weekly appointments list.
        selectTag = soup.find("select", {"id": "ctl00_MainContent_ddlWeeks"})
        optionValues = list(map(lambda x: x.get("value"), selectTag.find_all("option")))

        for i, date in enumerate(optionValues):
            # Get appointments info embedded inside of td tags
            table = soup.find("table", {"name": "regTable"})
            tds = table.find_all("td")

            # The first element of tds is either "目前尚無相關的開診資訊！" or static description "新冠肺炎疫苗"
            tds.pop(0)

            if len(tds) != 0:
                # seperate gov_paid and self_paid from tds
                if "自費" in tds[0].text:
                    self_paid, gov_paid = (
                        tds[1 : int(len(tds) / 2)],
                        tds[int(len(tds) / 2) + 1 :],
                    )
                else:
                    self_paid, gov_paid = (
                        tds[int(len(tds) / 2) + 1 :],
                        tds[1 : int(len(tds) / 2)],
                    )

                # Check if there is available appointments
                self_paid = list(
                    map(
                        lambda x: x.text,
                        (filter(filter_appointments_kmuh_kaohsiung, self_paid)),
                    )
                )
                gov_paid = list(
                    map(
                        lambda x: x.text,
                        (filter(filter_appointments_kmuh_kaohsiung, gov_paid)),
                    )
                )
                appointments[0], appointments[1] = len(self_paid) > 0, len(gov_paid) > 0

            if appointments == [True, True]:
                return appointments

            if i != len(optionValues) - 1:
                # Prepare data_dict for the next POST request
                post_data["__VIEWSTATE"] = soup.find(
                    "input", {"id": "__VIEWSTATE"}
                ).get("value")
                post_data["__EVENTVALIDATION"] = soup.find(
                    "input", {"id": "__EVENTVALIDATION"}
                ).get("value")
                post_data["ctl00$MainContent$ddlWeeks"] = optionValues[i + 1]

                # Launch POST request
                r = await session.post(url, data=post_data)
                raw_html = await r.text()
                soup = bs4.BeautifulSoup(raw_html, "html.parser")

    return appointments


def filter_appointments_kmuh_kaohsiung(element: bs4.element.Tag) -> bool:
    sub_strs = ["額滿", "停診"]
    return (
        all(sub_str not in element.text for sub_str in sub_strs) and element.text != ""
    )
