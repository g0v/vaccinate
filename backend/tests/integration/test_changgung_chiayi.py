import unittest
import os

from Parsers.changgung_chiayi import *
from hospital_types import AppointmentAvailability, HospitalAvailabilitySchema


class TestChanggungChiayi(unittest.TestCase):
    def test_full(self) -> None:
        with open("backend/tests/saved_pages/changgung_chiayi_full.html") as html_file:
            expected_availability: HospitalAvailabilitySchema = {
                "self_paid": AppointmentAvailability.UNAVAILABLE,
                "government_paid": AppointmentAvailability.NO_DATA,
            }
            availability = parse_changgung_chiayi(html_file.read())
            self.assertEqual(availability, (21, expected_availability))

    def test_available(self) -> None:
        with open(
            "backend/tests/saved_pages/changgung_chiayi_available.html"
        ) as html_file:
            expected_availability: HospitalAvailabilitySchema = {
                "self_paid": AppointmentAvailability.AVAILABLE,
                "government_paid": AppointmentAvailability.NO_DATA,
            }
            availability = parse_changgung_chiayi(html_file.read())
            self.assertEqual(availability, (21, expected_availability))
