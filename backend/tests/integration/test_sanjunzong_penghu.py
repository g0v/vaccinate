import unittest
import os

from Parsers.sanjunzong_penghu import *
from hospital_types import AppointmentAvailability, HospitalAvailabilitySchema


class TestSanjunzongPenghu(unittest.TestCase):
    def test_full(self) -> None:
        with open("backend/tests/saved_pages/sanjunzong_penghu_full.html") as html_file:
            expected_availability: HospitalAvailabilitySchema = {
                "self_paid": AppointmentAvailability.UNAVAILABLE,
                "government_paid": AppointmentAvailability.NO_DATA,
            }
            availability = parse_sanjunzong_penghu(html_file.read())
            self.assertEqual(availability, (31, expected_availability))

    def test_available(self) -> None:
        with open(
            "backend/tests/saved_pages/sanjunzong_penghu_available.html"
        ) as html_file:
            expected_availability: HospitalAvailabilitySchema = {
                "self_paid": AppointmentAvailability.AVAILABLE,
                "government_paid": AppointmentAvailability.NO_DATA,
            }
            availability = parse_sanjunzong_penghu(html_file.read())
            self.assertEqual(availability, (31, expected_availability))
