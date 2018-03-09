# Find My Books [WIP]
_COS333 Project Spring 2018_

A web application to help Princeton students find their coursebooks.
Fetches textbook pricing information from Labyrinth Bookstore, Amazon, and the Textbook Exchange Facebook group,
and also serves as a textbook trading platform.

## Setup
It is recommended to use yarn instead of NPM.
```
git clone https://github.com/rfblue2/find-my-books.git
yarn install
cd client && yarn install
cd ..
```

## Testing in Development
To test locally, you can run the server and clients separately.  The server runs on port 3001 by default and the client
runs on port 3000.  If you wish to change the port in which the server runs, you must also ensure that the proxy port
given in the client's package.json is changed accordingly.
```
yarn run dev # runs client and server concurrently
```

Or run these two lines in different terminal windows to separate the output.
```
yarn run server
yarn run client
```

Before each commit, lint your files with `yarn run lint` which will run ESLint over all your files.

## Testing production
In production the react app will be bundled into client/build using the script `yarn build`.  To test this locally, run
```
yarn run prod
```

This app is deployed in production via Heroku.
