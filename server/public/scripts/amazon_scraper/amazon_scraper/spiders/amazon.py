# -*- coding: utf-8 -*-
import scrapy
import json
from ..items import AmazonScraperItem
from ..items import BookOption


class AmazonSpider(scrapy.Spider):
    name = "amazon"

    # 
    with open('results.json') as blackboard_results:
        classes = json.load(blackboard_results)
    list_blackboard_ISBNs = []
    for course in classes:
        if "bookList" in course:
            for book in course["bookList"]:
                if book:
                    list_blackboard_ISBNs.append(book["ISBN"])

    start_urls = ["https://www.campusbooks.com/search/{0}?condition%5Bnew%5D=new&condition%5Bused%5D=used&rental_period=0&postal_code=08540&buysellrent=buy&op=Apply+Filters&form_build_id=form-JPpsrJqHKfZ7FLJEFh_LL_ibJWGBITegB9RgsE9vejM&form_id=cb_search_filters_form".format(isbn) for isbn in list_blackboard_ISBNs]

    def parse(self, response):

        allOffers = response.xpath('//div[@class = "standard-offers"]')
        options = allOffers.xpath('.//table[@class = "table table-condensed"]')

        buying_options = []

        for option in options:
            bookOption = BookOption()

            bookOption['condition'] = option.xpath('.//td[@class = "condition"]/text()').extract_first().strip()
            bookOption['price'] = option.xpath('.//td[@class = "price hidden-xs"]/text()').extract_first().strip()[1:]
            bookOption['seller'] = option.xpath('.//span[@class = "sprite-logo"]/@title').extract_first()
            bookOption['link'] = option.xpath('.//button[@class = "btn orange-btn btn-fit"]/../@href').extract_first()
            buying_options.append(dict(bookOption))

        scraperItem = AmazonScraperItem()
        scraperItem["isbn"] = response.request.url[35:48]
        scraperItem["options"] = buying_options

        yield scraperItem
