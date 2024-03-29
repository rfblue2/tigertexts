# Tiger Texts [beta]
_COS333 Project Spring 2018_

Your one stop shop for all your Princeton Coursebook shopping needs!
Fetches textbook pricing information from Labyrinth Bookstore, and Amazon,
and also serves as a textbook trading platform.  Visit the site at [tigertexts.io](https://www.tigertexts.io).

## Setup
It is recommended to use yarn instead of NPM.
```
git clone https://github.com/rfblue2/find-my-books.git
yarn install
cd client && yarn install
cd ..
```
You will also have to install MongoDB.

## Testing in Development
To test locally, you can run the server and clients separately.  The server runs on port 3001 by default and the client
runs on port 3000.  If you wish to change the port in which the server runs, you must also ensure that the proxy port
given in the client's package.json is changed accordingly.
First, make sure MongoDB is running (start it with `sudo mongod`). If you get an error similar to ".../data/db not found", make a folder in the root directory called "data" (`mkdir data`) and start MongoDB with `sudo mongod --dbpath ./data`.
Then run
```
yarn run dev # runs client and server concurrently
```

Or run these two lines in different terminal windows to separate the output.
```
yarn run server
yarn run client
```

### Testing and Linting
This project uses ESLint to lint the javascript files.  To run ESLint to automatically correct or report styling issues, run `yarn run lint`.

Mocha is used in conjunction with chai to test the API.  Run this with `yarn run test`.

## Testing production
In production the react app will be bundled into client/build using the script `yarn build`.  To test this locally, run
```
yarn run prod
```

This app is deployed in production via Heroku. DNS settings are managed with Namecheap.
