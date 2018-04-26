# -*- coding: utf-8 -*-

# Define here the models for your scraped items
#
# See documentation in:
# http://doc.scrapy.org/en/latest/topics/items.html

import scrapy


class BlackboardCrawlerItem(scrapy.Item):
    # define the fields for your item here like:
    # name = scrapy.Field()
    name = scrapy.Field()
    course_ID = scrapy.Field()
    instructor = scrapy.Field()
    description = scrapy.Field()
    bookList = scrapy.Field()


class BookPage(scrapy.Item):
    title = scrapy.Field()
    author = scrapy.Field()
    image = scrapy.Field()
    ISBN = scrapy.Field()
    datePublished = scrapy.Field()
    publisher = scrapy.Field()
    required = scrapy.Field()
    price = scrapy.Field()
