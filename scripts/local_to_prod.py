# The meta refresh in post_listings.py takes an extremely long time.
# When updating prod listing, makes more sense to just push exactly what's on local to prod.

import json
import requests
import sys
import urllib3

def local_to_prod():
  urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)
  
  local_url = "https://localhost:3001/api/" + sys.argv[1]
  print local_url
  prod_url = "https://tigertexts.herokuapp.com/api/" + sys.argv[1]
  print prod_url
  headers = {'Content-type': 'application/json'}

  # Make mapping from book title to database ID (generated by Mongo)
  books = json.loads(requests.get(local_url, verify = False).text)['data']
  counter = 0
  for entry in books:
    data = {'data': entry}
    requests.post(prod_url, data = json.dumps(data), headers = headers, verify = False)
    counter += 1
    if counter % 100 == 0:
      print "Listing %d" % counter

if __name__ == '__main__':
  local_to_prod()
