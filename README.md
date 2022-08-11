# Bike Rental App

I'll assume that you have Node.js installed on your machine!

# Environment Configuration

In the server directory, you'll have a .env file in which you can define the port that the server is going to run at.

In the client diretory, you'll have a second .env file in which you can define the server port & the host of your server machine.

# Running Dev Environment

First, run the backend;

- cd server
- yarn install
- yarn run dev

Second, run the frontend;

- cd client
- yarn install
- yarn start

This will open up your default browser, relocate to URL http://localhost:3000 and you will be able to use development environment of Bike Rental.

# Running Production Build

First, build the frontend;

- cd client
- yarn install
- yarn run build

Second, run the backend;

- cd server
- yarn install
- yarn start

Open your browser, relocate to URL http://localhost:{PORT_IN_ENV_FILES} and the client React application will be served from the server of Bike Rental.