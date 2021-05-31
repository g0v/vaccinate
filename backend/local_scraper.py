import redis, os
from typing import (
    TypedDict,
    Tuple,
    Dict,
    Callable,
    List,
    Any,
    Optional,
    NewType,
    cast,
    Coroutine,
)
from enum import Enum
from hospital_types import (
    AppointmentAvailability,
    ScrapedData,
    HospitalAvailabilitySchema,
)
from dotenv import load_dotenv
import asyncio
import aiohttp
import time
import sys


START_TIME: float = time.time()


# Parsers
from Parsers.ntu import *
from Parsers.tzuchi_taipei import *
from Parsers.changgung_chiayi import *
from Parsers.tzuchi_hualien import *
from Parsers.pch_nantou import *
from Parsers.mohw import *
from Parsers.tonyen_hsinchu import *
from Parsers.siaogang_kaohsiung import *
from Parsers.ncku_tainan import *
from Parsers.kmuh_kaohsiung import *
from Parsers.sanjunzong_penghu import *

load_dotenv()

API_URL: Optional[str] = os.environ.get("API_URL")
API_KEY: Optional[str] = os.environ.get("API_KEY")


def error_boundary(
    s: Scraper,
) -> Callable[[], Coroutine[None, None, Optional[ScrapedData]]]:
    async def boundaried_function() -> Optional[ScrapedData]:
        try:
            f_start: float = time.time()
            value = await s.scrape()
            print("----%s: %s-----" % (type(s).__name__, str(time.time() - f_start)))
            return value
        except:
            print("----%s: Unexpected error:" % type(s).__name__, sys.exc_info()[0])
            return None

    return boundaried_function


def make_uploader(s: Scraper) -> Callable[[], Coroutine[None, None, HospitalID]]:
    async def scrape_and_upload() -> HospitalID:
        scraper = error_boundary(s)
        result = await scraper()
        if not result:
            return ""
        (hospital_id, availability) = result
        primitive_availability = {k: v.__str__() for k, v in availability.items()}

        timeout = aiohttp.ClientTimeout(total=5)
        async with aiohttp.ClientSession(timeout=timeout) as session:
            global API_URL
            url_root = API_URL
            if url_root is None:
                raise NameError("API URL not specified.")
            response = await session.post(
                url_root + "/hospital",
                json={
                    "api_key": API_KEY,
                    "hospital_id": hospital_id,
                    "availability": primitive_availability,
                },
            )
            if response.status != 200:
                raise aiohttp.ClientError("Updating hospitals failed.")
        return hospital_id

    return scrape_and_upload


PARSERS: List[Scraper] = [
    TzuchiHualien(),
    TonyenHsinchu(),
    TzuchiTaipei(),
    SiaogangKaohsiung(),
    SanjunzongPenghu(),
    NtuTaipei(),
    NtuYunlin(),
    NtuHsinchu(),
    NckuTainan(),
    MohwKeelung(),
    MohwTaoyuan(),
    MohwMiaoli(),
    MohwTaichung(),
    MohwNantou(),
    MohwTaitung(),
    MohwKinmen(),
    KmuhKaohsiung(),
    ChanggungChiayi(),
]


async def scrape() -> None:
    """Example Hello Redis Program"""
    await asyncio.gather(*[make_uploader(p)() for p in PARSERS])


async def get_hospital_availability() -> Dict[HospitalID, HospitalAvailabilitySchema]:
    return dict(
        filter(
            None, list(await asyncio.gather(*[error_boundary(p)() for p in PARSERS]))
        )
    )


if __name__ == "__main__":
    asyncio.run(scrape())
    print("--- %s seconds ---" % (time.time() - START_TIME))
