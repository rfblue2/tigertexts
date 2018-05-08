# -*- coding: utf-8 -*-

# Define here the models for your scraped items
#
# See documentation in:
# http://doc.scrapy.org/en/latest/topics/items.html

import scrapy


class AmazonScraperItem(scrapy.Item):
    # define the fields for your item here like:
    # name = scrapy.Field()
    isbn = scrapy.Field()
    options = scrapy.Field()

class BookOption(scrapy.Item):

    seller = scrapy.Field()
    price = scrapy.Field()
    condition = scrapy.Field()
    link = scrapy.Field()
