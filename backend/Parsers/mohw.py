from bs4 import BeautifulSoup
from hospital_types import (
    AppointmentAvailability,
    ScrapedData,
    HospitalAvailabilitySchema,
)
from Parsers.Scraper import Scraper
import aiohttp


class MohwKeelung(Scraper):
    hospital_id = "0111070010"

    async def scrape(self) -> ScrapedData:
        return await parse_mohw(
            self.hospital_id, "netreg.kln.mohw.gov.tw", "0196", "0499"
        )


class MohwTaoyuan(Scraper):
    hospital_id = "0132010014"

    async def scrape(self) -> ScrapedData:
        return await parse_mohw(
            self.hospital_id, "tyghnetreg.tygh.mohw.gov.tw", "0126", "0125"
        )


class MohwMiaoli(Scraper):
    hospital_id = "0135010016"

    async def scrape(self) -> ScrapedData:
        self_paid_available = (
            await parse_mohw_page("reg2.mil.mohw.gov.tw", "CO23")
            or await parse_mohw_page("reg2.mil.mohw.gov.tw", "CO11")
            or await parse_mohw_page("reg2.mil.mohw.gov.tw", "CO41")
        )
        gov_paid_available = (
            await parse_mohw_page("reg2.mil.mohw.gov.tw", "CO02")
            or await parse_mohw_page("reg2.mil.mohw.gov.tw", "CO04")
            or await parse_mohw_page("reg2.mil.mohw.gov.tw", "CO01")
        )

        availability: HospitalAvailabilitySchema = {
            "self_paid": AppointmentAvailability.AVAILABLE
            if bool(self_paid_available)
            else AppointmentAvailability.UNAVAILABLE,
            "government_paid": AppointmentAvailability.AVAILABLE
            if bool(gov_paid_available)
            else AppointmentAvailability.UNAVAILABLE,
        }

        return (
            self.hospital_id,
            availability,
        )


class MohwTaichung(Scraper):
    hospital_id = "0117030010"

    async def scrape(self) -> ScrapedData:
        return await parse_mohw(
            self.hospital_id, "www03.taic.mohw.gov.tw", "01CD", "01CC"
        )


class MohwNantou(Scraper):
    hospital_id = "01138020015"

    async def scrape(self) -> ScrapedData:
        return await parse_mohw(
            self.hospital_id, "netreg01.nant.mohw.gov.tw", "0220", "0219"
        )


class MohwTaitung(Scraper):
    hospital_id = "0146010013"

    async def scrape(self) -> ScrapedData:
        return await parse_mohw(
            self.hospital_id, "netreg01.tait.mohw.gov.tw", "0119", "0519"
        )


class MohwKinmen(Scraper):
    hospital_id = "190030516"

    async def scrape(self) -> ScrapedData:
        return await parse_mohw(
            self.hospital_id, "netreg.kmhp.mohw.gov.tw", "104A", "1047"
        )


async def parse_mohw(
    hospital_id: str, hostname: str, self_paid_id: str, gov_paid_id: str
) -> ScrapedData:
    self_paid_available = await parse_mohw_page(hostname, self_paid_id)
    gov_paid_available = await parse_mohw_page(hostname, gov_paid_id)
    availability: HospitalAvailabilitySchema = {
        "self_paid": AppointmentAvailability.AVAILABLE
        if bool(self_paid_available)
        else AppointmentAvailability.UNAVAILABLE,
        "government_paid": AppointmentAvailability.AVAILABLE
        if bool(gov_paid_available)
        else AppointmentAvailability.UNAVAILABLE,
    }
    return (
        hospital_id,
        availability,
    )


async def parse_mohw_page(hostname: str, div_dr: str) -> bool:
    entrypoint_url = (
        "https://{}/OINetReg/OINetReg.Reg/Reg_RegTable.aspx?DivDr={}&Way=Dept".format(
            hostname, div_dr
        )
    )
    regtable_url = "https://{}/OINetReg/OINetReg.Reg/Sub_RegTable.aspx".format(hostname)

    timeout = aiohttp.ClientTimeout(total=10)
    async with aiohttp.ClientSession(timeout=timeout) as s:
        # get session from this page
        await s.get(entrypoint_url)

        # request first week of reservations
        r = await s.get(regtable_url)
        raw_html = await r.text()

        # if first page shows available reservations, exit early
        if parse_mohw_week_page(raw_html):
            return True

        soup = BeautifulSoup(raw_html, "html.parser")

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
            r = await s.post(regtable_url, data=states)
            raw_html = await r.text()
            if parse_mohw_week_page(raw_html):
                return True

        return False


def parse_mohw_week_page(body: str) -> bool:
    soup = BeautifulSoup(body, "html.parser")

    # return if there's any link found in the page
    result = [x for x in soup.find_all("a") if x.text != ""]
    return bool(result)
