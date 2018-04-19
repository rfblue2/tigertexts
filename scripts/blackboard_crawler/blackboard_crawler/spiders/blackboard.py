# -*- coding: utf-8 -*-
import scrapy
from ..items import BlackboardCrawlerItem
from ..items import Book
import re


class BlackboardSpider(scrapy.Spider):
    # name of this spider. Do not comment out
    name = "blackboard"

    # URL to start scraping from
    start_urls = ['https://blackboard.princeton.edu/webapps/blackboard/execute/viewCatalog?id=&type=Course&command=NewSearch&moduleId=&searchField=CourseName&searchOperator=NotBlank&searchText=&dateSearchOperator=GreaterThan&dateSearchDate_datetime=2017-10-16+14%3A54%3A00&pickdate=&pickname=&dateSearchDate_date=10%2F16%2F2017']


    # default parse method. Sends to parse_after_refresh because classes only
    # load after refreshing the Blackboard site
    def parse(self, response):

        # random operation to make sure the page loads
        classes = response.xpath('//tr[contains(@id, "listContainer_row")]')

        # refresh the page
        url = 'https://blackboard.princeton.edu/webapps/blackboard/execute/viewCatalog?id=&type=Course&command=NewSearch&moduleId=&searchField=CourseName&searchOperator=NotBlank&searchText=&dateSearchOperator=GreaterThan&dateSearchDate_datetime=2017-10-16+14%3A54%3A00&pickdate=&pickname=&dateSearchDate_date=10%2F16%2F2017'
        yield scrapy.Request(url, callback=self.parse_after_refresh)

    # actual parse method once the classes have loaded
    def parse_after_refresh(self, response):
        # string to prepend for links
        beginning = "https://blackboard.princeton.edu"

        # get sections for class info
        classes = response.xpath('//tr[contains(@id, "listContainer_row")]')

        # iterate through the classes
        for c in classes:
            # link to the class page
            classLink = c.xpath('.//a[contains(@target, "top")]/@href').extract_first()

            # create the crawler item
            item = BlackboardCrawlerItem()

            item['course_ID'] = c.xpath('.//th[contains(@scope, "row")]/text()').extract_first().strip()
            classInfo = c.xpath('.//span[contains(@class, "table-data-cell-value")]/text()').extract()

            item['name'] = classInfo[0]

            if len(classInfo) == 3:
                item['instructor'] = classInfo[1]
                item['description'] = classInfo[2]


            elif len(classInfo) == 2:
                item['description'] = classInfo[1]

            # next request for the class page
            if classLink:
                r = scrapy.Request(url = beginning+classLink, callback = self.parseClassPage)

                r.meta['item'] = item

                # tell scrapy to process the request
                yield r

            else:
                yield item


        nextPageLink = response.xpath('//a[contains(@id, "listContainer_nextpage_top")]/@href').extract_first()
        if nextPageLink:
            yield scrapy.Request(url = beginning+nextPageLink, callback = self.parse_after_refresh)
        
    def parseClassPage(self, response):

        # get the class item sent from previous response
        item = response.meta['item']

        # for prepending links
        beginning = "https://blackboard.princeton.edu"

        # get the link to the reading list
        readingListLink = response.xpath('//span[contains(text(), "Reading List")]/../@href').extract_first()

        # check class had a reading list link
        if readingListLink:

            # create request for the reading list
            r = scrapy.Request(url = beginning+readingListLink, callback = self.parseReadingList)
            r.meta['item'] = item

            yield r

        # yield the item if there's no reading list
        else:

            yield item

    # finally process the actual reading list
    def parseReadingList(self, response):
        # get the item sent in
        item = response.meta['item']

        requiredBookSection = response.xpath('//div[contains(@id, "containerdiv")]')

        requiredBooksInfo = requiredBookSection.xpath('.//div[contains(@class, "viewReading")]')

        bookList = []

        for book in requiredBooksInfo:
            global bookList
            bookItem = Book()

            bookItem['image'] = 'https://blackboard.princeton.edu' + book.xpath('.//img/@src').extract()[0]
            titleAndISBN = book.xpath('.//td[contains(@class, "textBold")]/text()').extract()

            if (len(titleAndISBN) == 0):
                continue

            bookItem['title'] = titleAndISBN[0]
            bookItem['ISBN'] = titleAndISBN[1]

            author = book.xpath('.//td[contains(@class, "textItalic")]/text()').extract_first()

            bookItem['author'] = author

            allText = book.xpath('.//td[contains(@class, "text")]/text()').extract()
            publisher = allText[7]
            date = allText[9]

            bookItem['publisher'] = publisher
            bookItem['datePublished'] = date
            bookItem['required'] = True

            # Only if price exists / book is at Labyrinth
            if book.xpath('.//td[contains(@class, "shoppingCart")]//div[@class = "textElement"]'):
                bookItem['price'] = book.xpath('.//td[contains(@class, "shoppingCart")]//div[@class = "textElement"]/text()').extract()[0]
                bookItem['price'] = bookItem['price'][bookItem['price'].index("$") + 1:]
            bookList.append(dict(bookItem))


        allBooksInfo = response.xpath('//div[contains(@class, "viewReading")]')

        for book in allBooksInfo:

            titleAndISBN = book.xpath('.//td[contains(@class, "textBold")]/text()').extract()

            if (len(titleAndISBN) == 0):
                continue

            if not any(b['ISBN'] == titleAndISBN[1] for b in bookList):
                bookItem = Book()
                bookItem['image'] = 'https://blackboard.princeton.edu' + book.xpath('.//img/@src').extract()[0]

                bookItem['title'] = titleAndISBN[0]
                bookItem['ISBN'] = titleAndISBN[1]

                author = book.xpath('.//td[contains(@class, "textItalic")]/text()').extract_first()

                bookItem['author'] = author

                allText = book.xpath('.//td[contains(@class, "text")]/text()').extract()
                publisher = allText[7]
                date = allText[9]

                bookItem['publisher'] = publisher
                bookItem['datePublished'] = date
                bookItem['required'] = False

                # Only if price exists / book is at Labyrinth
                if book.xpath('.//td[contains(@class, "shoppingCart")]//div[@class = "textElement"]'):
                    bookItem['price'] = book.xpath('.//td[contains(@class, "shoppingCart")]//div[@class = "textElement"]/text()').extract()[0]
                    bookItem['price'] = bookItem['price'][bookItem['price'].index("$") + 1:]

                bookList.append(dict(bookItem))


        item['bookList'] = bookList

        yield item
