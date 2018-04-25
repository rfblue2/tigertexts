# -*- coding: utf-8 -*-

# Define here the models for your scraped items
#
# See documentation in:
# http://doc.scrapy.org/en/latest/topics/items.html

import scrapy



class LabyrinthCrawlerItem(scrapy.Item):
    # define the fields for your item here like:
    # name = scrapy.Field()
    title = scrapy.Field()
    author = scrapy.Field()
    isbn = scrapy.Field()
    newPrice = scrapy.Field()
    veryGoodPrice = scrapy.Field()
    likeNewPrice = scrapy.Field()
    acceptablePrice = scrapy.Field()
    usedPrice = scrapy.Field()
    imageLink = scrapy.Field()
