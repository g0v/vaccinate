from typing import TypedDict, Tuple, Dict
from enum import Enum


HospitalID = int


class AppointmentAvailability(Enum):
    AVAILABLE = "Available"
    UNAVAILABLE = "Unavailable"
    NO_DATA = "No data"


class Hospital(TypedDict):
    address: str
    availability: AppointmentAvailability
    department: str
    hospitalId: HospitalID
    location: str
    name: str
    phone: str
    website: str
