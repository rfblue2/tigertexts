# -*- coding: utf-8 -*-
import scrapy
from ..items import LabyrinthCrawlerItem
import re

class LabyrinthSpider(scrapy.Spider):
    name = "labyrinth"

    # List of URLs to start scraping from
    start_urls = ['http://www.labyrinthbooks.com/all_search.aspx?ssubcode=%d__' %n for n in range(0,100)]

    def parse(self, response):
        beginning = "http://www.labyrinthbooks.com/"
        books = response.css('.title')
        for b in books:
            title = b.css('.title::text').extract_first()
            bookUrl = b.css('.title::attr(href)').extract_first()
            # create new LabyrinthCrawlerItem with specified fields
            item = LabyrinthCrawlerItem()

            # adding the extracted title to the item's title field
            item['title'] = title

            # Go into book page to get more detailed info on ISBN and price
            r = scrapy.Request(url=beginning+bookUrl, callback = self.parseBook)
            r.meta['item'] = item
            # tell scrapy to process this item
            yield r

        nextPageLinkSelector = response.css('#pgTop_hypNext::attr("href")')
        if nextPageLinkSelector:
            nextPageLink = nextPageLinkSelector[0].extract()
            yield scrapy.Request(url = nextPageLink)

    def parseBook(self, response):
        item = response.meta['item']

        # extract author information and remove 3 characters for "By "
        author = response.css('.author::text').extract_first()
        item['author'] = author[3:]

        isbn = ""

        # Need to loop through all because Labyrinth isn't consistent
        for possibleIsbns in response.css('.nowrap::text'):
            if "ISBN" in possibleIsbns.extract():
                isbn = possibleIsbns.extract()
                break
        item['isbn'] = isbn[6:]

        # Get prices based on book condition and store in correct field
        priceString = response.css('#ctl02_rptDetails_ctl00_lblWhere::text').extract_first()
        conditionsPricesString = priceString.split('>')[1]
        conditionsPricesList = conditionsPricesString.split(',')

        imagelink = response.xpath('//td[contains(@width, "168")]//img/@src').extract_first()
        item['imageLink'] = "http://www.labyrinthbooks.com" + imagelink

        for conditionPrice in conditionsPricesList:
            if "Like New" in conditionPrice:
                item['likeNewPrice'] = re.findall(r'\d+.\d+', conditionPrice)[0]
                continue
            if "New" in conditionPrice:
                item['newPrice'] = re.findall(r'\d+.\d+', conditionPrice)[0]
                continue
            if "Very" in conditionPrice:
                item['veryGoodPrice'] = re.findall(r'\d+.\d+', conditionPrice)[0]
                continue
            if "Acceptable" in conditionPrice:
                item['acceptablePrice'] = re.findall(r'\d+.\d+', conditionPrice)[0]
                continue
            if "Used" in conditionPrice:
                item['usedPrice'] = re.findall(r'\d+.\d+', conditionPrice)[0]
                continue

        yield item
