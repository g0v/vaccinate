import unittest

from local_scraper import hospitalAvailability


class TestParsers(unittest.TestCase):
    def test_parsers(self) -> None:
        """
        Test that none of the parsers return None.
        """
        data = hospitalAvailability()
        print(data)
