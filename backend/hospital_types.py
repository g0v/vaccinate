from typing import TypedDict, Tuple, Dict, NewType
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


class HospitalAvailabilitySchema(TypedDict):
    self_paid: AppointmentAvailability
    government_paid: AppointmentAvailability


ScrapedData = Tuple[int, HospitalAvailabilitySchema]
