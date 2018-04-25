# Blackboard Crawler
Goes to the course catalog, searches for classes created after 10/18/2017 (meaning that it finds spring 2018, summer 2018, and fall 2018 classes),
and outputs the reading list for each class in a json format. If a reading list is not available, the json will contain as much 
information as possible from the course catalog page.

## Getting started
install scrapy 
```
pip install scrapy
```

### Files to be aware of
The two most important files are blackboard_crawler/spiders/blackboard.py and blackboard_crawler/items.py

items.py defines the BlackboardCrawlerItem class, which acts like a dictionary with certian allowed fields. 
This determines what information the json output wll have.

blackboard.py is the where the scraping logic is.

### Running the scraper
WHEN RUNNING THE SCRAPER YOU MUST BE IN THE SAME FOLDER AS THE "scrapy.cfg" FILE

To send json to one file and the debugging output to another file, use a command like
```
scrapy crawl blackboard -o results.json -t json 2 > error.txt
```

This will send the json ouput to a "results.json" and the debugging output to "error.txt"

For only the json output, use command
```
scrapy crawl blackboard -o results.json
```

## Output

Example output would appear as:
```
{"course_ID": "AAS300_F2018", "instructor": "Naomi Murakawa, Joshua Guild", "bookList": [], "name": "AAS300_F2018 Junior Seminar: Research and Writing in African American Studies", "description": "As a required course for AAS concentrators, this junior seminar introduces students to theories and methods of research design in African American Studies. Drawing on a wide-ranging methodological toolkit from the humanities and social sciences, students will learn to reflect on the ethical and political dimensions of original research in order to produce knowledge that is intellectually and socially engaged. This is a writing-intensive seminar with weekly essay assignments."},
{"course_ID": "AAS319-LAS368_S2018", "instructor": "Reena Goldthree", "bookList": [{"publisher": "University of Chicago Press", "ISBN": "9780226211381", "author": "Gaiutra Bahadur", "title": "Coolie Woman", "required": true, "datePublished": "2014-08-04"}, {"publisher": "University of Pennsylvania Press", "ISBN": "9780812248227", "author": "Marisa J. Fuentes", "title": "Dispossessed Lives", "required": true, "datePublished": "2016-05-31"}, {"publisher": "Duke University Press", "ISBN": "9780822323969", "author": "Eileen J. Suarez Findlay", "title": "Imposing Decency", "required": true, "datePublished": "2000-01-25"}, {"publisher": "University of Minnesota Press", "ISBN": "9780816636808", "author": "T. Denean Sharpley-Whiting", "title": "Negritude Women", "required": true, "datePublished": "2002-10-08"}, {"publisher": "Duke University Press", "ISBN": "9780822325932", "author": "Maria de Los Reyes Castillo Bueno; Daisy Rubiera Castillo (As told to); Elizabeth Dore (Foreword by); Anne McLean (Translator)", "title": "Reyita", "required": true, "datePublished": "2000-11-21"}, {"publisher": "Cornell University Press", "ISBN": "9780801487484", "author": "Beverly Bell; Edwidge Danticat (Foreword by)", "title": "Walking on Fire", "required": true, "datePublished": "2001-12-13"}], "name": "AAS319-LAS368_S2018 Caribbean Women's History", "description": "This seminar investigates the historical experiences of women in the Caribbean from the era of European conquest to the late twentieth century. We will examine how shifting conceptions of gender, sexuality, race, class, and the body have shaped understandings of womanhood and women's rights. We will engage a variety of sources - including archival documents, films, newspaper accounts, feminist blogs, music, and literary works - in addition to historical scholarship and theoretical texts. The course will include readings on the Spanish-, English-, and French-speaking Caribbean as well as the Caribbean diaspora."},
{"course_ID": "AAS242-ENG242_S2018", "instructor": "Nijah Cunningham", "bookList": [{"publisher": "Beacon Press", "ISBN": "9780807083673", "author": "Patricia Powell", "title": "A Small Gathering of Bones", "required": true, "datePublished": "2003-12-01"}, {"publisher": "Monthly Review Press", "ISBN": "9781583670255", "author": "Aime Cesaire; Joan Pinkham; Robin D. G. Kelly (Translator)", "title": "Discourse on Colonialism", "required": true, "datePublished": "2001-01-01"}, {"publisher": "Grove/Atlantic, Incorporated", "ISBN": "9780802136336", "author": "Dionne Brand", "title": "In Another Place, Not Here", "required": true, "datePublished": "2000-02-02"}, {"publisher": "University of Virginia Press", "ISBN": "9780813927671", "author": "Maryse Conde; Mercure de France (Contribution by)", "title": "I, Tituba", "required": true, "datePublished": "2009-02-05"}, {"publisher": "Wesleyan University Press", "ISBN": "9780819575678", "author": "M. NourbeSe Philip; Evie Shockley (Contribution by); Wesleyan Poetry Staff", "title": "She Tries Her Tongue, Her Silence Softly Breaks", "required": true, "datePublished": "2015-10-06"}], "name": "AAS242-ENG242_S2018 Other Futures: An Introduction to Modern Caribbean Literature", "description": "This course introduces students to major theories and debates within the study of Caribbean literature and culture with a particular focus on the idea of catastrophe. Reading novels and poetry that address the historical loss and injustices that have given shape to the modern Caribbean, we will explore questions of race, gender, and sexuality and pay considerable attention to the figure of the black body caught in the crosscurrents of a catastrophic history. We will analyze how writers and artists attempted to construct alternative images of the future from the histories of slavery and colonialism that haunt the Caribbean and its diasporas."},
```

Information on pricing will depend on what conditions the books are in. For a complete list of fields for each class:
```
    name = scrapy.Field()
    course_ID = scrapy.Field()
    instructor = scrapy.Field()
    description = scrapy.Field()
    bookList = scrapy.Field()
```
The bookList holds a list of book dictionaries. For each book dictionary, there are the fields:
```
    title = scrapy.Field()
    author = scrapy.Field()
    ISBN = scrapy.Field()
    datePublished = scrapy.Field()
    publisher = scrapy.Field()
    required = scrapy.Field()
 ```
