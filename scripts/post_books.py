import json
import requests
import sys

def post_books():
  raw = json.load(open('blackboard_crawler/results.json'))

  # Delete classes without book
  for i in range(len(raw) - 1, -1, -1):
    if 'bookList' not in raw[i].keys():
      del raw[i]

  host = ''
  if sys.argv[1] == 'local':
    host = 'localhost:3001'
  elif sys.argv[1] == 'prod':
    host = 'tigertexts.herokuapp.com'

  classes_url = 'http://' + host + '/api/classes' # API Endpoint (change to localhost:3001 if testing locally)
  print classes_url
  books_url = 'http://' + host + '/api/books'
  print books_url
  headers = {'Content-type': 'application/json'}

  # Make mapping from course ID (generated by Mongo) to database ID
  classes = json.loads(requests.get(classes_url).text)['data']
  class_to_id = dict()

  for item in classes:
    # Not all IDs are unique because some classes are cross listed
    for number in item['attributes']['numbers']:
      class_to_id[number] = item['id']

  # Post books
  book_dict = dict()
  counter = 0
  for line in raw:
    for book in line['bookList']:
      # Some books might appear in multiple listings (like Practice of Programming in COS333/217)
      if book['title'] not in book_dict.keys():
        book_attributes = {'title': book['title'], 'authors': book['author'],
        'isbn': book['ISBN']}
        if 'image' in book.keys():
          book_attributes['image'] = book['image']
        number = line['course_ID'].split('_')[0].split('-')[0] # Cross listed courses have same ID
        id_list = [{'id': class_to_id[number], 'type': 'class'}]
        data = {'data': {'type': 'book', 'attributes': book_attributes, 'relationships': {'classes': {'data': id_list}}}}
        book_dict[book['title']] = data
      else:
        data = book_dict[book['title']]
        data['data']['relationships']['classes']['data'].append({'id': class_to_id[number], 'type': 'class'})
        book_dict[book['title']] = data

  for book in book_dict:
    requests.post(books_url, data = json.dumps(book_dict[book]), headers = headers)
    counter += 1
    if counter % 100 == 0:
      print "Book %d" % counter

  print "Done POSTING books"

if __name__ == '__main__':
  post_books()