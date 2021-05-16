import unittest
import os

from Parsers.pch_nantou import *
from hospital_types import AppointmentAvailability, HospitalAvailabilitySchema


class TestChanggungChiayi(unittest.TestCase):
    def test_full(self) -> None:
        with open("backend/tests/saved_pages/pch_nantou_full.html") as html_file:
            expected_availability: HospitalAvailabilitySchema = {
                "self_paid": AppointmentAvailability.UNAVAILABLE,
                "government_paid": AppointmentAvailability.NO_DATA,
            }
            availability = parse_pch_nantou(html_file.read())
            self.assertEqual(availability, (17, expected_availability))

    def test_available(self) -> None:
        with open("backend/tests/saved_pages/pch_nantou_available.html") as html_file:
            expected_availability: HospitalAvailabilitySchema = {
                "self_paid": AppointmentAvailability.AVAILABLE,
                "government_paid": AppointmentAvailability.NO_DATA,
            }
            availability = parse_pch_nantou(html_file.read())
            self.assertEqual(availability, (17, expected_availability))
