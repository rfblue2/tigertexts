# Labyrinth Crawler
Iterates through all categories of books on the Labyrinth website and scrapes the book title, author, isbn, and price 
based on condition (new/very good/like new/acceptable/used)

## Getting started
install scrapy 
```
pip install scrapy
```

### Files to be aware of
The two most important files are labyrinth_crawler/spiders/labyrinth.py and labyrinth_crawler/items.py

items.py defines the LabyrinthCrawlerItem class, which acts like a dictionary with certian allowed fields. 
This determines what information the json output wll have.

labyrinth.py is the where the scraping logic is.

### Running the scraper
WHEN RUNNING THE SCRAPER YOU MUST BE IN THE SAME FOLDER AS THE "scrapy.cfg" FILE

To send json to one file and the debugging output to another file, use a command like
```
scrapy crawl labyrinth -o results.json -t json 2 > error.txt
```

This will send the json ouput to a "results.json" and the debugging output to "error.txt"

For only the json output, use command
```
scrapy crawl labyrinth -o results.json
```

## Output

Example output would appear as:
```
{"title": "Abolition Democracy", "isbn": "9781583226957", "newPrice": "12.95", "author": "Davis, Angela Y."},
{"likeNewPrice": "4.46", "title": "Aeneid of Virgil", "isbn": "9780553210415", "author": "Virgil & Allen Mandelbaum, trans."},
{"title": "Advanced Reader of Modern Chinese : China's Own Critics: Text/Vocabulary and Sentence Patterns", "isbn": "9780691000695", "newPrice": "35.98", "author": "Chih-p'ing Chou, et al."}
```

Information on pricing will depend on what conditions the books are in. For a complete list of fields:
```
    title = scrapy.Field()
    author = scrapy.Field()
    isbn = scrapy.Field()
    newPrice = scrapy.Field()
    veryGoodPrice = scrapy.Field()
    likeNewPrice = scrapy.Field()
    acceptablePrice = scrapy.Field()
    usedPrice = scrapy.Field()
```

