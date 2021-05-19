import abc

from hospital_types import (
    ScrapedData
)


class Scraper(metaclass=abc.ABCMeta):

    @property
    @abc.abstractmethod
    def hospital_id(self) -> str:
        pass

    @abc.abstractmethod
    async def scrape(self) -> ScrapedData:
        pass