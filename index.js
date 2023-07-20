const express = require('express');
const app = express();
const bodyParser = require('body-parser');
morgan = require('morgan');
const mongoose = require('mongoose');
const Models = require('./models.js');
const Movies = Models.Movie;
const Users = Models.User;
const Directors = Models.Director;
const Genres = Models.Genre;
mongoose.connect(process.env.CONNECTION_URI, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => console.log("MongoDB connected")).catch((err) => console.log(err));
app.use(morgan('common'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const { check, validationResult } = require('express-validator');
const cors = require('cors');
let allowedOrigins = ['http://fabiflix.netlify.app',' http://localhost:8090', 'http://localhost:1234', 'http://testsite.com', 'https://upload.wikimedia.org/wikipedia/en/8/8a/The_Lord_of_the_Rings_The_Fellowship_of_the_Ring_%282001%29.jpg', 'http://localhost:4200', 'https://fabian-movie-api.onrender.com', 'https://m.media-amazon.com', 'https://m.media-amazon.com/images/I/91mKjMkIMjL._AC_UY218_.jpg', 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Washington_National_Cathedral_Crucifix_constructed_from_war_material.jpg/2560px-Washington_National_Cathedral_Crucifix_constructed_from_war_material.jpg', 'https://upload.wikimedia.org/wikipedia/commons/c/ca/Heat_%281995%29_logo.png', 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Sincity-logo.svg/2560px-Sincity-logo.svg.png', 'https://upload.wikimedia.org/wikipedia/de/thumb/2/20/Matrix-logo.svg/2880px-Matrix-logo.svg.png', 'youtube.com', 'https://fabimi.github.io', 'https://github.com'];
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      //If a specific origin isn't found on the list of alloed origins
      let message = 'The CORS policy for this application doesnt allow acces from origin' + origin;
      return callback(new Error(message), false);
    }
    return callback(null, true);
  }
}));

/**
 * @description Import the auth.js file
 * @type {auth}
 */
let auth = require('./auth')(app);
const passport = require('passport');//Import the passport.js file
require('./passport');

/** 
* @description  Get the welcome message
* @name  GET / 
* @function 
* @example
* // Request data format
*  none
* @example
* // Response data format
* "This is my fantastic Movie App"
* 
* @param {authentication} - Bearen token (JWT)
*/
app.get('/', (req, res) => {
  res.send('This is my fantastic Movie App');
});


/** 
* @description  Get to the secret URL
* @name   GET /secreturl
* @function
* @example
* // Request data format
* none
* @example
* // Response data format
* "This is a secret url with super top-secret content."
* 
* @param {authentication} - Bearen token (JWT)
*/
app.get('/secreturl', (req, res) => {
  res.send('This is a secret url with super top-secret content.');
});

/**
 * @description Get all movies
 * @name GET /movies
 * @function
 * @example
 * // Request data format
 * none
 * @example
 * // Response data format
 * [
 *   {
 *     "Title": "",
 *     "Description": "",
 *     "Genre": {
 *       "Name": "",
 *       "Description": "",
 *     },
 *     "Director": {
 *       "Name": "",
 *       "Bio": "",
 *     },
 *     "Actors": [""],
 *     "ImagePath": "",
 *     "Featured": Boolean,
 *     "Trailerpath": ""
 *   }
 * ]
 * @param {authentication} - Bearen token (JWT)
 */
app.get("/movies", function (req, res) {
  Movies.find()
    .then(function (movies) {
      res.status(201).json(movies);
    })
    .catch(function (error) {
      console.error(error);
      res.status(500).send("Error: " + error);
    });
});

/** 
* @description  Get a movie by title
* @name   GET /movies/:title
* @function
* @example
* // Request data format
*   none
* @example
* // Response data format
* {
*   "Title": "",
*   "Description": "",
*   "Genre": {
*     "Name": "",
*     "Description": "",
*   },
*   "Director": {
*     "Name": "",
*     "Bio": "",
*   },
*   "Actors": [""],
*   "ImagePath": "",
*   "Featured": Boolean,
*   "Trailerpath": ""
* }
* 
* @param {authentication} - Bearen token (JWT)
*/
app.get('/movies/:title', passport.authenticate('jwt', { session: false }), (req, res) => {
  Movies.findOne({ Title: req.params.title })
    .then((movies) => {
      res.status(201).json(movies);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

/**
 * @description Get Movie Genre
 * @name GET /genre/:name
 * @function
 * @example
 * // Request data format
 * none
 * @example
 * // Response data format
 * {
 *   "Name": "",
 *   "Description": "",
 * }
 * @param {authentication} - Bearen token (JWT)
 */

app.get('/genre/:name', passport.authenticate('jwt', { session: false }), (req, res) => {
  Genres.find({ Name: req.params.name })
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

/** 
* @description  Get a director by name
* @name  GET /director/:name  
* @function
* @example
* // Request data format
*   none
* @example
* // Response data format
* { 
*   "Name": "",
*   "Bio": "",
*   "Birth": "",
*   "Death": ""
* } 
* 
* @param {authentication} - Bearen token (JWT)
*/
app.get('/director/:name', passport.authenticate('jwt', { session: false }), (req, res) => {
  Directors.find({ Name: req.params.name })
    .then((movies) => {
      res.json(movies);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});
/**
 * @description Create a user
 * @name POST /users/:name
 * @function
 * @example
 * // Request data format
 * {
 *  "Username": "",
 *  "Password": "",
 *  "Email": "",
 *  "Birthday:" ""
 * }
 * @example
 * // Response data format
 * {
 *  "_id": "",
 *  "Username": "",
 *  "Password": "",
 *  "Email": "",
 *  "Birthday": "",
 *  "Fav_Movie": []
 * }
 * @param {authentication} - Bearen token (JWT)
 */

app.post('/users', [
  check('Username', 'Username is required').isLength({ min: 5 }),
  check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
  check('Password', 'Password is required').not().isEmpty(),
  check('Email', 'Email does not appear to be valid').isEmail()
], (req, res) => {
  let errors = validationResult(req);

  //If the request body doesnt contain the required fields return the message below
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  //Hash the password sent by the user when registering before storing it in the database
  let hashedPassword = Users.hashPassword(req.body.Password);

  //Check if a user with the same username already exists
  Users.findOne({ Username: req.body.Username })
    .then((user) => {
      if (user) {
        return res.status(400).send(req.body.Username + 'already exists');
      } else {

        //If the user doesnt exist, create a new user
        Users
          .create({
            Username: req.body.Username,
            Password: hashedPassword,
            Email: req.body.Email,
            Birthday: req.body.Birthday
          })
          .then((user) => { res.status(201).json(user) })
          .catch((error) => {
            console.error(error);
            res.status(500).send('Error: ' + error);
          })
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Error: ' + error);
    });
});

/**
 * @description Update a user
 * @name PUT /users/:name
 * @function
 * @example
 * // Request data format
 * {
 *  "Username": "",
 *  "Password": "",
 *  "Email": "",
 *  "Birthday:" ""
 * }
 * @example
 * // Response data format
 * {
 *  "_id": "",
 *  "Username": "",
 *  "Password": "",
 *  "Email": "",
 *  "Birthday": "",
 *  "Fav_Movie": []
 * }
 * @param {authentication} - Bearen token (JWT)
 */
app.put('/users/:name', passport.authenticate('jwt', { session: false }), (req, res) => {
  let hashedPassword = Users.hashPassword(req.body.Password);
  Users.findOneAndUpdate({ Username: req.params.name }, {
    $set:
    {
      Username: req.body.Username,
      Password: hashedPassword,
      Email: req.body.Email,
      Birthday: req.body.Birthday
    }
  },
    { new: true }, // This line makes sure that the updated document is returned
    (err, updatedUser) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error: ' + err);
      } else {
        res.json(updatedUser);
      }
    });
});

/**
 * @description Get a user by username
 * @name GET /users/:name
 * @function
 * @example
 * // Request data format
 * none
 * @example
 * // Response data format
  * { 
  * "_id": "",
  * "Username": "",
  * "Password": "",
  * "Email": "",
  * "Birthday": "",
  *  "Fav_Movie": []
  * }
 * }
 * @param {authentication} - Bearen token (JWT)
 */
app.get('/users/:name', (req, res) => {
  Users.findOne({ Username: req.params.name })
    .then((user) => {
      res.status(201).json(user);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});


/** 
* @description  Get a user by username
* @name   GET /users/:name/movies
* @function
* @example
* // Request data format
*   none
* @example
* // Response data format
* {
*   "Username": "",
*   "Password": "",
*   "Email": "",
*   "Birthday": "",
*   "Fav_Movie": [
*     {
*       "Title": "",
*       "Description": "",
*       "Genre": {
*         "Name": "",
*         "Description": "",
*       "Director": { 
*       },  
*       "Actors": [""],
*       "ImagePath": "",
*       "Featured": Boolean,
*       "Trailerpath": ""
*     }
* 
* @param {authentication} - Bearen token (JWT)
*/
app.post('/users/:name/movies/:Id', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.name }, {
    $push: { Fav_Movie: req.params.Id }
  },
    { new: true }, // This line makes sure that the updated document is returned
    (err, updatedUser) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error: ' + err);
      } else {
        res.json(updatedUser);
      }
    });
});

/** 
* @description  delete a users favorite movie
* @name   DELETE /users/:name/movies/:Id
* @function
* @example
* // Request data format
*  none
* @example
* // Response data format
* { 
*   "Username": "",
*   "Password": "",
*   "Email": "",
*   "Birthday": "",
*   "Fav_Movie": [
*     {
*       "Title": "",
*       "Description": "",
*       "Genre": {
*         "Name": "",
*         "Description": "",
*       "Director": {
*       },
*       "Actors": [""],
*       "ImagePath": "",
*       "Featured": Boolean,
*       "Trailerpath": ""
*     }
* 
* @param {authentication} - Bearen token (JWT)
*/
app.delete('/users/:name/movies/:Id', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.name }, {
    $pull: { Fav_Movie: req.params.Id }
  },
    { new: true }, // This line makes sure that the updated document is returned
    (err, updatedUser) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error: ' + err);
      } else {
        res.json(updatedUser);
      }
    });
});

/** 
* @description   delete a user by username
* @name   DELETE /users/:name
* @function
* @example
* // Request data format
*   none
* @example
* // Response data format
* "Username was deleted."
* 
* @param {authentication} - Bearen token (JWT)
*/
app.delete('/users/:name', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOneAndRemove({ Username: req.params.name })
    .then((user) => {
      if (!user) {
        res.status(400).send(req.params.name + ' was not found');
      } else {
        res.status(200).send(req.params.name + ' was deleted.');
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

/** 
* @description  Get documentation
* @name   GET /documentation
* @function
* @example
* // Request data format
*   none
* @example
* // Response data format
* "THE the documentation page"
* 
* @param {authentication} - Bearen token (JWT)
*/
app.get('/documentation', (req, res) => {
  res.sendFile('/public/documentation.html', { root: __dirname });
});
app.use('/documentation', express.static('public'));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});


/** listen for requests **/
const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0', () => {
  console.log('Listening on Port ' + port);
});

