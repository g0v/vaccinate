import argparse
import redis, os, json
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
    async def scrape_and_upload() -> [HospitalID, dict]:
        scraper = error_boundary(s)
        result = await scraper()
        if not result:
            return None
        (hospital_id, availability) = result
        primitive_availability = {k: v.value for k, v in availability.items()}

        return (hospital_id, primitive_availability)

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


async def get_hospital_availability() -> Dict[HospitalID, HospitalAvailabilitySchema]:
    return dict(
        filter(
            None, list(await asyncio.gather(*[error_boundary(p)() for p in PARSERS]))
        )
    )

def send_to_redis(r: redis.StrictRedis, hospital_id: str, availability: HospitalAvailabilitySchema) -> None:
    primitive_availability = {k: v.__str__() for k, v in availability.items()}

    r.hset(
        "hospital_schema_3:" + str(hospital_id),
        key=None,
        value=None,
        # pyre-fixme[6]: Pyre cannot make Dict[str, str] compatible with their HSet type.
        mapping=primitive_availability,
    )

    return

if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description="Scrapes availability from hospitals"
    )
    parser.add_argument(
        "--redis",
        action="store_true",
        default=False,
        help="""Send results to a Redis server. Server info can be overriden with env vars:
            REDIS_HOST=localhost,
            REDIS_PORT=6379,
            REDIS_USERNAME="",
            REDIS_PASSWORD="",
            REDIS_SSL="yes" (Set to "no" for non-SSL connection)
        """,
    )

    parser.add_argument("--out", help="Output JSON to a file.")

    flag_values: argparse.Namespace = parser.parse_args()

    load_dotenv()
    data = asyncio.run(get_hospital_availability())
    print(data)

    any_error = False

    if flag_values.redis:
        r = redis.StrictRedis(
            host=os.environ.get("REDIS_HOST") or "localhost",
            port=os.environ.get("REDIS_PORT") or "6379",
            username=os.environ.get("REDIS_USERNAME") or "",
            password=os.environ.get("REDIS_PASSWORD") or "",
            ssl=(os.environ.get("REDIS_SSL") != "no"),
            socket_timeout=10
        )

        print("Sending result to Redis...")

        try:
            for hospital_id, availability in data.items():
                send_to_redis(r, hospital_id, availability)
        except Exception as e:
            print("Failed to send to Redis:", type(e).__name__, "-", e)
            any_error = True

    if flag_values.out != None:
        with open(flag_values.out, 'w') as fout:
            print(json.dumps(data, indent=2), file=fout)

    print("--- %s seconds ---" % (time.time() - START_TIME))
