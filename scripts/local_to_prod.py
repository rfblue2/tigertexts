# The meta refresh in post_listings.py takes an extremely long time.
# When updating prod listing, makes more sense to just push exactly what's on local to prod.

import json
import requests
import sys
import urllib3

def local_to_prod():
  urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)
  
  local_url = "https://localhost:3001/api/listings"
  print local_url
  prod_url = "https://tigertexts.herokuapp.com/api/listings"
  print prod_url
  books_url = "https://tigertexts.herokuapp.com/api/books"
  headers = {'Content-type': 'application/json'}

  # Make mapping from book title to database ID (generated by Mongo)
  books = json.loads(requests.get(books_url, verify = False).text)['data']
  book_to_id = dict()

  for item in books:
    # Not all IDs are unique because some classes are cross listed
    book_to_id[item['attributes']['title']] = item['id']

  # Make mapping from book title to database ID (generated by Mongo)
  listings = json.loads(requests.get(local_url, verify = False).text)['data']
  counter = 0
  for entry in listings:
    entry['relationships']['book']['data']['id'] = book_to_id[entry['attributes']['title']]
    data = {'data': entry}
    requests.post(prod_url, data = json.dumps(data), headers = headers, verify = False)
    counter += 1
    if counter % 100 == 0:
      print "Listing %d" % counter
  print "Done POSTING local listings to prod"

if __name__ == '__main__':
  local_to_prod()
