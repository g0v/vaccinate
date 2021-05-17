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
redis_ssl: Optional[bool] = (os.environ.get("REDIS_SSL") != "no") # default is true means to use SSL

def error_boundary(
    f: Callable[[], Coroutine[Any, Any, ScrapedData]]
) -> Callable[[], Coroutine[Any, Any, Optional[ScrapedData]]]:
    async def boundaried_function() -> Optional[ScrapedData]:
        try:
            f_start: float = time.time()
            value = await f()
            print("----%s: %s-----" % (f.__name__, str(time.time() - f_start)))
            return value
        except:
            print("----%s: Unexpected error:" % f.__name__, sys.exc_info()[0])
            return None

    return boundaried_function


PARSERS: List[Callable[[], Coroutine[Any, Any, Optional[ScrapedData]]]] = [
    error_boundary(parse_ntu_taipei),
    error_boundary(parse_ntu_hsinchu),
    error_boundary(parse_ntu_yunlin),
    error_boundary(parse_tzuchi_taipei),
    error_boundary(parse_tzuchi_hualien),
    error_boundary(scrape_changgung_chiayi),
    error_boundary(scrape_pch_nantou),
    error_boundary(parse_mohw_taoyuan),
    error_boundary(parse_mohw_keelung),
    error_boundary(parse_mohw_miaoli),
    error_boundary(parse_mohw_taichung),
    error_boundary(parse_mohw_taitung),
    error_boundary(parse_mohw_kinmen),
    error_boundary(parse_mohw_nantou),
    error_boundary(scrape_tonyen_hsinchu),
    error_boundary(scrape_siaogang_kaohsiung),
    error_boundary(parse_ncku_tainan),
    error_boundary(parse_kmuh_kaohsiung),
    error_boundary(scrape_sanjunzong_penghu),
]


async def get_hospital_availability() -> List[ScrapedData]:
    availability: List[ScrapedData] = list(
        filter(None, list(await asyncio.gather(*[f() for f in PARSERS])))
    )
    as_dict: Dict[int, HospitalAvailabilitySchema] = dict(availability)
    for i in range(1, 32):
        if i in as_dict:
            continue
        else:
            as_dict[i] = {
                "self_paid": AppointmentAvailability.NO_DATA,
                "government_paid": AppointmentAvailability.NO_DATA,
            }
    print(list(as_dict.items()))
    return list(as_dict.items())


async def scrape() -> None:
    """Example Hello Redis Program"""

    # step 3: create the Redis Connection object
    try:

        # The decode_repsonses flag here directs the client to convert the responses from Redis into Python strings
        # using the default encoding utf-8.  This is client specific.
        r: redis.StrictRedis = redis.StrictRedis(
            host=redis_host,
            port=redis_port,
            password=redis_password,
            decode_responses=True,
            username=redis_username,
            socket_timeout=10,
            ssl=redis_ssl,
        )

        def set_availability(
            hospital_id: int,
            availability: HospitalAvailabilitySchema,
        ) -> None:
            f: Callable[[AppointmentAvailability], str] = lambda x: x.__str__()
            # pyre-fixme[6]: Pyre cannot detect that the objects here are AppointmentAvailability
            primitive_availability = {k: f(v) for k, v in availability.items()}
            r.hset(
                "hospital_schema_2:" + str(hospital_id),
                key=None,
                value=None,
                # pyre-fixme[6]: Pyre cannot make Dict[str, str] compatible with their HSet type.
                mapping=primitive_availability,
            )

        availability = await get_hospital_availability()

        [
            set_availability(hospital_availability[0], hospital_availability[1])
            for hospital_availability in availability
        ]

    except Exception as e:
        print(e)


if __name__ == "__main__":
    asyncio.run(scrape())
    print("--- %s seconds ---" % (time.time() - START_TIME))
