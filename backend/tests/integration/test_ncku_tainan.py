import unittest
import os

from Parsers.ncku_tainan import *
from hospital_types import AppointmentAvailability, HospitalAvailabilitySchema


class TestNckuTainan(unittest.TestCase):
    def test_both_full(self) -> None:
        with open("backend/tests/saved_pages/ncku_tainan_full.html") as html_file:
            expected_availability: HospitalAvailabilitySchema = {
                "self_paid": AppointmentAvailability.UNAVAILABLE,
                "government_paid": AppointmentAvailability.UNAVAILABLE,
            }
            html = html_file.read()
            availability = NckuTainan().parse_ncku_tainan(html, html)
            self.assertEqual(
                availability, (NckuTainan().hospital_id, expected_availability)
            )

    def test_both_available(self) -> None:
        with open("backend/tests/saved_pages/ncku_tainan_available.html") as html_file:
            expected_availability: HospitalAvailabilitySchema = {
                "self_paid": AppointmentAvailability.AVAILABLE,
                "government_paid": AppointmentAvailability.AVAILABLE,
            }
            html = html_file.read()
            availability = NckuTainan().parse_ncku_tainan(html, html)
            self.assertEqual(
                availability, (NckuTainan().hospital_id, expected_availability)
            )

    def test_one_available(self) -> None:
        html_available = open("backend/tests/saved_pages/ncku_tainan_available.html")
        html_full = open("backend/tests/saved_pages/ncku_tainan_full.html")
        expected_availability: HospitalAvailabilitySchema = {
            "self_paid": AppointmentAvailability.AVAILABLE,
            "government_paid": AppointmentAvailability.UNAVAILABLE,
        }
        html_self_paid = html_available.read()
        html_gov_paid = html_full.read()
        html_available.close()
        html_full.close()
        availability = NckuTainan().parse_ncku_tainan(html_self_paid, html_gov_paid)
        self.assertEqual(
            availability, (NckuTainan().hospital_id, expected_availability)
        )
