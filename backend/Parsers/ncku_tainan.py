import bs4, requests
from hospital_types import (
    AppointmentAvailability,
    HospitalAvailabilitySchema,
    ScrapedData,
)
from Parsers.Scraper import Scraper
import aiohttp
import ssl


CERT: str = "../data/hosp-ncku-edu-tw-chain.pem"
URL_SELF_PAID = "https://service.hosp.ncku.edu.tw/Tandem/MainUI.aspx?Lang=&skv=EzNec8%2bb3OYprHkqM83gBiNJ2d6GNAz2gvscJU0dxqw%3d"
URL_GOV_PAID = "https://service.hosp.ncku.edu.tw/Tandem/MainUI.aspx?Lang=&skv=EzNec8%2bb3ObBGuEQakq0QawPuiWkTewUO9FjEuW3Njo%3d"


class NckuTainan(Scraper):

    hospital_id = "0421040011"

    async def scrape(self) -> ScrapedData:
        sslcontext = ssl.create_default_context(cafile=CERT)
        timeout = aiohttp.ClientTimeout(total=10)
        async with aiohttp.ClientSession(timeout=timeout) as session:
            async with session.get(URL_SELF_PAID, timeout=timeout) as r:
                html_self_paid = await r.text()
            async with session.get(URL_GOV_PAID, timeout=timeout) as r:
                html_gov_paid = await r.text()
        return self.parse_ncku_tainan(html_self_paid, html_gov_paid)

    def parse_ncku_tainan(self, html_self_paid: str, html_gov_paid: str) -> ScrapedData:
        availability: HospitalAvailabilitySchema = {
            "self_paid": self.check_available_ncku_tainan(
                URL_SELF_PAID, html_self_paid
            ),
            "government_paid": self.check_available_ncku_tainan(
                URL_GOV_PAID, html_gov_paid
            ),
        }
        return (
            self.hospital_id,
            availability,
        )

    def check_available_ncku_tainan(
        self, url: str, html: str
    ) -> AppointmentAvailability:
        # Initial data_dict for POST method later.
        post_data = {
            "__EVENTTARGET": "ctl00$MainContent$ddlWeeks",
            "__EVENTARGUMENT": "",
            "__LASTFOCUS": "",
            "__VIEWSTATE": "",
            "__VIEWSTATEGENERATOR": "",
            "__SCROLLPOSITIONX": "0",
            "__SCROLLPOSITIONY": "0",
            "__EVENTVALIDATION": "",
            "ctl00$MainContent$ddlWeeks": "",
            "ctl00$MainContent$ddlNoons": "",
            "ctl00$MainContent$ddlWeeks_02": "",
        }

        # Get first day of each weekly appointments list.
        soup = bs4.BeautifulSoup(html, "html.parser")
        select_tag = soup.find("select", {"id": "ctl00_MainContent_ddlWeeks"})
        option_values = list(
            map(lambda x: x.get("value"), select_tag.find_all("option"))
        )

        for i, date in enumerate(option_values):
            # Check if there is an available appointment.
            table = soup.find("table", {"id": "tRegSchedule"})
            tds = table.find_all("td", {"class": "p-0"})
            appointments = list(
                filter(lambda td: bool(td.find("a")) and "轉掛" not in td.text, tds)
            )

            if bool(appointments):
                return AppointmentAvailability.AVAILABLE

            if i == len(option_values) - 1:
                break

            # Prepare data_dict for the next POST request
            post_data["__VIEWSTATE"] = soup.find("input", {"id": "__VIEWSTATE"}).get(
                "value"
            )
            post_data["__VIEWSTATEGENERATOR"] = soup.find(
                "input", {"id": "__VIEWSTATEGENERATOR"}
            ).get("value")
            post_data["__EVENTVALIDATION"] = soup.find(
                "input", {"id": "__EVENTVALIDATION"}
            ).get("value")
            post_data["ctl00$MainContent$ddlWeeks"] = option_values[i + 1]
            post_data["ctl00$MainContent$ddlWeeks_02"] = date

            # Launch POST request
            # Using sync since each data_dict in POST request depends on previous html text.
            r = requests.post(url, verify=CERT, data=post_data, timeout=5)
            soup = bs4.BeautifulSoup(r.text, "html.parser")

        return AppointmentAvailability.UNAVAILABLE
