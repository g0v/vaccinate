import redis, os
from typing import TypedDict, Tuple, Dict, Callable, List, Any, Optional, NewType
from enum import Enum
from hospital_types import AppointmentAvailability, ScrapedData
from dotenv import load_dotenv


# Parsers
from Parsers.ntu_taipei import *
from Parsers.ntu_hsinchu import *
from Parsers.ntu_yunlin import *
from Parsers.tzuchi_taipei import *
from Parsers.changgung_chiayi import *
from Parsers.tzuchi_hualien import *
from Parsers.pch_nantou import *
from Parsers.mohw import *
from Parsers.tonyen_hsinchu import *


load_dotenv()

redis_host: Optional[str] = os.environ.get("REDIS_HOST")
redis_port: Optional[str] = os.environ.get("REDIS_PORT")
redis_username: Optional[str] = os.environ.get("REDIS_USERNAME")
redis_password: Optional[str] = os.environ.get("REDIS_PASSWORD")


def errorBoundary(f: Callable[[], ScrapedData]) -> Callable[[], Optional[ScrapedData]]:
    def boundariedFunction() -> Optional[ScrapedData]:
        try:
            return f()
        except:
            return None

    return boundariedFunction


PARSERS: List[Callable[[], Optional[ScrapedData]]] = [
    errorBoundary(parseNTUH),
    errorBoundary(parseNTUHHsinchu),
    errorBoundary(parseNTUHYunlin),
    errorBoundary(parseTzuchiTaipei),
    errorBoundary(parseTzuchiHualien),
    errorBoundary(parseChanggungChiayi),
    errorBoundary(parsePchNantou),
    errorBoundary(parseMOHWKeelung),
    errorBoundary(parseMOHWTaoyuan),
    errorBoundary(parseMOHWMiaoli),
    errorBoundary(parseMOHWTaichung),
    errorBoundary(parseMOHWTaitung),
    errorBoundary(parseMOHWKinmen),
    errorBoundary(parseTonyenHsinchu),
]


def hospitalAvailability() -> List[ScrapedData]:
    availability: List[Optional[ScrapedData]] = [f() for f in PARSERS]
    print(availability)
    return list(filter(None, availability))


def hello_redis() -> None:
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
            ssl=True,
        )

        def setAvailability(
            hospital_id: int, availability: AppointmentAvailability
        ) -> None:
            r.set("hospital:" + str(hospital_id), availability.__str__())

        availability = hospitalAvailability()

        [
            setAvailability(hospital_availability[0], hospital_availability[1])
            for hospital_availability in availability
        ]

    except Exception as e:
        print(e)


if __name__ == "__main__":
    hello_redis()
