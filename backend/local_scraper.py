import redis, os
from typing import TypedDict, Tuple, Dict, Callable, List, Any, Optional, NewType
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

redis_host: Optional[str] = os.environ.get("REDIS_HOST")
redis_port: Optional[str] = os.environ.get("REDIS_PORT")
redis_username: Optional[str] = os.environ.get("REDIS_USERNAME")
redis_password: Optional[str] = os.environ.get("REDIS_PASSWORD")


# The decode_repsonses flag here directs the client to convert the responses from Redis into Python strings
# using the default encoding utf-8.  This is client specific.
r: redis.StrictRedis = redis.StrictRedis(
    host=redis_host,
    port=redis_port,
    password=redis_password,
    decode_responses=True,
    username=redis_username,
    socket_timeout=10,
    ssl=True,
)


def error_boundary(
    s: Scraper,
) -> Callable[[], Coroutine[Any, Any, Optional[ScrapedData]]]:
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


def make_uploader(s: Scraper) -> Callable[[], Coroutine[Any, Any, HospitalID]]:
    async def scrape_and_upload() -> HospitalID:
        scraper = error_boundary(s)
        result = await scraper()
        if not result:
            return ""
        (hospital_id, availability) = result
        primitive_availability = {k: v.__str__() for k, v in availability.items()}

        print(primitive_availability)
        r.hset(
            "hospital_schema_3:" + str(hospital_id),
            key=None,
            value=None,
            # pyre-fixme[6]: Pyre cannot make Dict[str, str] compatible with their HSet type.
            mapping=primitive_availability,
        )
        return s.hospital_id

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
