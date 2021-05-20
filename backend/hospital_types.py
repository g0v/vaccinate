from typing import TypedDict, Tuple, Dict, NewType
from enum import Enum


HospitalID = str


class AppointmentAvailability(str, Enum):
    AVAILABLE: str = "Available"
    UNAVAILABLE: str = "Unavailable"
    NO_DATA: str = "No data"


class Hospital(TypedDict):
    address: str
    department: str
    governmentPaidAvailability: AppointmentAvailability
    hospitalId: HospitalID
    location: str
    name: str
    phone: str
    selfPaidAvailability: AppointmentAvailability
    website: str


class HospitalAvailabilitySchema(TypedDict):
    self_paid: AppointmentAvailability
    government_paid: AppointmentAvailability


ScrapedData = Tuple[HospitalID, HospitalAvailabilitySchema]
