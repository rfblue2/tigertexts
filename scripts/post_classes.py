import json
import requests
import sys
import urllib3

def post_classes():
  urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)
  raw = json.load(open('blackboard_crawler/results.json'))

  # Delete classes without book
  for i in range(len(raw) - 1, -1, -1):
    if 'bookList' not in raw[i].keys() or 'F2018' in raw[i]['course_ID']:
      del raw[i]

  host = ''
  if sys.argv[1] == 'local':
    host = 'localhost:3001'
  elif sys.argv[1] == 'prod':
    host = 'tigertexts.herokuapp.com'

  classes_url = 'https://' + host + '/api/classes' # API Endpoint (change to localhost:3001 if testing locally)
  print classes_url
  books_url = 'https://' + host + '/api/books'
  print books_url
  headers = {'Content-type': 'application/json'}

  # Post classes
  counter = 0
  for line in raw:
    # Class names typically begin with the course ID
    # Class IDs end with '_(Semester)', and the portion before is delimitted by '-'.
    # E.g. AAS322-LAS301_F2018
    class_attributes = {'title': line['name'].replace(line['course_ID'], '').lstrip(), 
    'numbers': line['course_ID'].split('_')[0].split('-')}
    data = {'data': {'type': 'class', 'attributes': class_attributes}}
    r = requests.post(classes_url, data = json.dumps(data), headers = headers, verify = False)
    if not r.ok:
      print('Could not POST %s' % line['course_ID'])
    counter += 1
    if counter % 100 == 0:
      print "Class %d" % counter
  print "Done POSTING classes"

if __name__ == '__main__':
  post_classes()