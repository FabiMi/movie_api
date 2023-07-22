# Movie API 

## Description

This API allows you to manage movies, users, and authentication for MyFlixClient and myFlix-Angular-client. It is built using Node.js, Express, and MongoDB, and includes various dependencies to handle authentication, data validation, and more. Check out the documentation for more...


! [Screenshots/Screenshot 2023-07-22 at 16.25.37.png]


## Prerequisites

Before you begin, make sure you have the following installed on your system:

Node.js: Download Node.js
MongoDB: Install MongoDB


## Installation
To get started with the "movie_api" project, follow these steps:

Clone the repository:
bash
Copy code
git clone https://github.com/FabiMi/movie_api.git
Change to the project directory:
bash
Copy code
cd movie_api
Install the required dependencies:
bash
Copy code
npm install
Configuration
Before running the API, you need to configure some environment variables. Create a .env file in the root directory of the project and add the following variables:

makefile
Copy code
MONGODB_URI=your_mongodb_connection_string
SECRET_KEY=your_secret_key_for_jwt
Replace your_mongodb_connection_string with the connection string to your MongoDB database and your_secret_key_for_jwt with a secure secret key for JSON Web Token (JWT) authentication.

## Database Setup
Ensure that your MongoDB server is running. If it's not running as a service, start it using the following command:

bash
Copy code
mongod
Running the Application
Once everything is set up and configured, you can start the API server using the following command:

bash
Copy code
npm start
This will launch the server at http://localhost:3000.

.
