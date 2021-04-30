import redis, os
from typing import TypedDict, Tuple, Dict, Callable, List, Any, Optional
from enum import Enum
from hospital_types import Hospital, HospitalID, AppointmentAvailability
from dotenv import load_dotenv


# Parsers
from Parsers.ntu_taipei import *
from Parsers.ntu_hsinchu import *
from Parsers.ntu_yunlin import *
from Parsers.tzuchi_taipei import *
load_dotenv()

redis_host = os.environ.get("REDIS_HOST")
redis_port = os.environ.get("REDIS_PORT")
redis_username = os.environ.get("REDIS_USERNAME")
redis_password = os.environ.get("REDIS_PASSWORD") 


def errorBoundary(
    f: Callable[[], Tuple[int, AppointmentAvailability]]
) -> Callable[[], Optional[Tuple[int, AppointmentAvailability]]]:
    def boundariedFunction() -> Optional[Tuple[int, AppointmentAvailability]]:
        try:
            return f()
        except:
            return None

    return boundariedFunction


PARSERS: List[Callable[[], Tuple[int, AppointmentAvailability]]] = [
    errorBoundary(parseNTUH),
    errorBoundary(parseNTUHHsinchu),
    errorBoundary(parseNTUHYunlin),
    errorBoundary(parseTzuchiTaipei),
]


def hospitalAvailability() -> List[Tuple[int, AppointmentAvailability]]:
    availability: List[Optional[Tuple[int, AppointmentAvailability]]] = [
        f() for f in PARSERS
    ]
    print(availability)
    return list(filter(None, availability))


def hello_redis():
    """Example Hello Redis Program"""

    # step 3: create the Redis Connection object
    try:

        # The decode_repsonses flag here directs the client to convert the responses from Redis into Python strings
        # using the default encoding utf-8.  This is client specific.
        r = redis.StrictRedis(
            host=redis_host,
            port=redis_port,
            password=redis_password,
            decode_responses=True,
            username=redis_username,
            ssl=True,
        )

        def setAvailability(hospital_id: int, availability: AppointmentAvailability):
            r.set("test_hospital:" + str(hospital_id), availability.__str__())

        def getAvailability(hospital_id: int):
            return r.get("test_hospital:" + str(hospital_id))

        availability = hospitalAvailability()

        [
            setAvailability(hospital_availability[0], hospital_availability[1])
            for hospital_availability in availability
        ]

    except Exception as e:
        print(e)


if __name__ == "__main__":
    hello_redis()
