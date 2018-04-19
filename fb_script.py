import urllib3, facebook, requests

app_id = "234765570597629"
app_secret = "8dce7796926a04fd6f449e2c6fdcf9f7"  # DO NOT SHARE WITH ANYONE!
group_id = "179890775464779"
token = "EAADVhJ5w4v0BAFN4jB6UQ2XsLy2QT38Wq03NOaevnOURbiA8Ol1rQfwkCjGTJft1BRFDADO64bETTnyVovalhh2ZBQrgGnnG8oUxdAsWSWeCZAQLCB8qRvT0y1Tq3ZARjgTZBRLAZAZATD7KbKgmxigRm8Ie7tOb0ZD"
graph = facebook.GraphAPI(access_token=token, version = 2.7)
