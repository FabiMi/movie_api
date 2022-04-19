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
//mongoose.connect('mongodb://localhost:27017/myMovieDB',
mongoose.connect('process.env.CONNECTION_URI',
{useNewURLParser: true, useUnifiedTopology: true});
app.use(morgan('common'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const { check, validationResult } = require('express-validator');
const cors = require('cors');
let allowedOrigins = ['http://localhost:8090', 'http://testsite.com'];
app.use(cors({
  origin: (origin, callback) => {
    if(!origin) return callback(null, true);
    if(allowedOrigins.indexOf(origin) === -1){
      //If a specific origin isn't found on the list of alloed origins
      let message = 'The CORS policy for this application doesn#t allow acces from origin' + origin;
      return callback(new Error(message), false);
    }
    return callback(null, true);
  }
}));

/* rest of code goes here*/
let auth = require('./auth')(app);
const passport = require('passport');
require('./passport');


app.get('/', (req, res) => { 
  res.send('This is my fantastic Movie App');
});

app.get('/secreturl', (req, res) => {
  res.send('This is a secret url with super top-secret content.');
});

//Gets a list of all the movies
app.get('/movies', passport.authenticate('jwt', { session: false }),(req, res) => 
{ Movies.find() .then ((users) => {
  res.status(201).json(movies);
}).catch((err) => { console.error(err);
    res.status(500).send('Error: ' + err);
  })
  .catch((err) => { console.error(err);
    res.status(500).send('Error: ' + err);
  });
});
//Get one Movie by Title
  app.get('/movies/:title', (req, res) => {
    Movies.findOne({_id: req.params.movieId })
    .then ((movies) => { res.status(201).json(movies);
})
      .catch((err) => { console.error(err);
    res.status(500).send('Error: ' + err);
    });
  });

//Get Info about a Genre
  app.get('/genre/:name', (req, res) => {
    Genres.find({ Name : req.params.Name })
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});
  
//Get Info about a Director
  app.get('/director/:name', (req, res) => {
    Directors.find({ Name: rq.params.Name})
    .then((movies) => {
      res.json(movies);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// Create a new User
  app.post('/users',[
    check('Username', 'Username is required').isLength({min: 5}),
    check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
    check('Password', 'Password is required').not().isEmpty(),
    check('Email', 'Email does not appear to be valid').isEmail()
  ], (req, res) => {
    let errros = validationResult(req);

    if(!errros.isEmpty()) {return res.status(422).json({errors: errors.array()});
  }
    let hashedPassword = Users.hashPassword(req.body.Password);
   Users.findOne({ Name: req.body.Name })
    .then((user) => {
      if (user) {
        return res.status(400).send(req.body.Username + 'already exists');
      } else {
        Users
          .create({
            Username: req.body.Username,
            Password: hashedPassword,
            Email: req.body.Email,
            Birthday: req.body.Birthday
          })
          .then((user) =>{res.status(201).json(user) })
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

// Update a User by Name
  app.put('/users/:name', (req, res) => {
    Users.findOneAndUpdate({ Name: req.params.Name }, { $set:
      {
        Username: req.body.Username,
        Password: req.body.Password,
        Email: req.body.Email,
        Birthday: req.body.Birthday
      }
    },
    { new: true }, // This line makes sure that the updated document is returned
    (err, updatedUser) => {
      if(err) {
        console.error(err);
        res.status(500).send('Error: ' + err);
      } else {
        res.json(updatedUser);
      }
    });
  });

  //Add a Fav Movie to a Users List
  app.post('/users/:name/movies/:title', (req, res) => {
    Users.findOneAndUpdate({ Name: req.params.Name }, {
      $push: { Fav_Movie: req.params.MovieID }
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

//Delete a Fav Movie by a User
  app.delete('/users/:name/movies/:title', (req, res) => {
    Users.findOneAndRemove({ Fav_Movie: req.params.Fav_Movie})
    .then((movie) => {
      if (!movie) {
        res.status(400).send(req.params.Fav_Movie + ' was not found');
      } else {
        res.status(200).send(req.params.Fav_Movie + ' was deleted.');
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

//Delete a User
  app.delete('/users/:name', (req, res) => {
    Users.findOneAndRemove({ Username: req.params.Name })
    .then((user) => {
      if (!user) {
        res.status(400).send(req.params.Name + ' was not found');
      } else {
        res.status(200).send(req.params.Name + ' was deleted.');
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});



/* gets data about a single Movie , by title  
  app.get('/movies/:title', (req, res) => {
    res.json(movies.find((movies) =>
      { return movie.title === req.params.title }));
  });
  
 Adds data for a new movie to the Movie API
app.post('/movies', (req, res) => {
    let newMovie = req.body;
  
    if (!newMovie.title) {
      const message = 'Missing Movie Title in request body';
      res.status(400).send(message);
    } else {
      newMovie.id = uuid.v4();
      movies.push(newMovie);
      res.status(201).send(newMovie);
    }
  });*/


  app.get('/documentation', (req, res) => {                  
    res.sendFile('/public/documentation.html', { root: __dirname });
  });
  app.use('/documentation', express.static('public'));

  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
  });


  // listen for requests
  const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0',() => {
 console.log('Listening on Port ' + port);
});

