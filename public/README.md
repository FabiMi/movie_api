Movie App API

This is a backend API for a movie app built using Node.js and Express. It provides various endpoints to interact with movies, users, genres, and directors. This backend API is build for MyFlixClient and MyFlix-Angular-Client youll find both Repositories under github.com/FabiMi

Prerequisites

Node.js
MongoDB
Installation

Clone the repository: git clone <repository_url>

Install dependencies:

cd <project_folder>
npm install


Set up environment variables:

Create a .env file in the root directory and provide the following variables

CONNECTION_URI=<your_mongodb_connection_uri> (GEt the CONNECTION_URI from MongoDB)
PORT=<port_number>  (Your Port)


Start the server:
npm start

The server should now be running on the specified port.

API Endpoints

GET /movies
Retrieve a list of all movies.

GET /movies/:title
Retrieve a specific movie by title.

GET /genre/:name
Retrieve movies by genre name.

GET /director/:name
Retrieve movies by director name.

GET /users/:name
Retrieve a user by username.

POST /users
Create a new user. Required fields: Username, Password, Email, Birthday.

PUT /users/:name
Update a user's information by username.

DELETE /users/:name
Delete a user by username.

POST /users/:name/movies/:id
Add a movie to a user's list of favorites.

DELETE /users/:name/movies/:id
Remove a movie from a user's list of favorites.

GET /documentation
Retrieve the documentation page.

Authentication

This API uses JSON Web Tokens (JWT) for authentication. To access protected endpoints, include a valid JWT in the request headers.

Error Handling

If an error occurs, the server will respond with an appropriate error message along with the corresponding HTTP status code.

Third-Party Libraries

This project utilizes the following third-party libraries:

express: Web framework for Node.js
body-parser: Middleware for parsing request bodies
morgan: HTTP request logger middleware
mongoose: MongoDB object modeling tool
express-validator: Middleware for input validation
cors: Cross-origin resource sharing support
passport: Authentication middleware
Contributing

Contributions are welcome! If you find any issues or have suggestions for improvements, please open an issue or submit a pull request.


