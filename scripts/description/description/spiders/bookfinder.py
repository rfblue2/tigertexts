# -*- coding: utf-8 -*-
import scrapy
from ..items import DescriptionItem
import json

# reads in books from the results.json produced by the blackboard scraper
class BookfinderSpider(scrapy.Spider):
    name = "bookfinder"

    with open('results.json') as blackboard_results:
        classes = json.load(blackboard_results)
    list_blackboard_ISBNs = []
    for course in classes:
        if "bookList" in course:
            for book in course["bookList"]:
                if book:
                    list_blackboard_ISBNs.append(book["ISBN"])

    start_urls = ["http://www.bigwords.com/details/book/{0}".format(isbn) for isbn in list_blackboard_ISBNs]

    def parse(self, response):

        description = response.xpath('//div[not(@*)]//text()').extract_first()
        descriptionItem = DescriptionItem()
        descriptionItem['isbn'] = response.request.url[37:]
        descriptionItem['description'] = description
        descriptionItem['imageLink'] = response.xpath('//div[contains(@class, "prd_img")]//img/@src').extract_first()

        yield descriptionItem
