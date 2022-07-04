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
let allowedOrigins = ['http://localhost:8090' ,'http://localhost:1234'];
app.use(cors({
  origin: (origin, callback) => {
    if(!origin) return callback(null, true);
    if(allowedOrigins.indexOf(origin) === -1){
      //If a specific origin isn't found on the list of alloed origins
      let message = 'The CORS policy for this application doesnt allow acces from origin' + origin;
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

/*Gets a list of all the movies
app.get('/movies', passport.authenticate('jwt', { session: false }),(req, res) => 
{ Movies.find().then ((movies) => {
  res.status(201).json(movies);
}).catch((err) => { console.error(err);
    res.status(500).send('Error: ' + err);
  })
  .catch((err) => { console.error(err);
    res.status(500).send('Error: ' + err);
  });
});*/

// in my-flix/index.js

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


//Get one Movie by Title
  app.get('/movies/:title', passport.authenticate('jwt', { session: false }), (req, res) => {
    Movies.findOne({Title: req.params.title })
    .then ((movies) => { res.status(201).json(movies);
})
      .catch((err) => { console.error(err);
    res.status(500).send('Error: ' + err);
    });
  });

//Get Info about a Genre
  app.get('/genre/:name', passport.authenticate('jwt', { session: false }),(req, res) => {
    Genres.find({ Name : req.params.name })
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});
  
//Get Info about a Director
  app.get('/director/:name', passport.authenticate('jwt', { session: false }), (req, res) => {
    Directors.find({ Name: req.params.name})
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
    let errors = validationResult(req);

    if(!errors.isEmpty()) {return res.status(422).json({errors: errors.array()});
  }
    let hashedPassword = Users.hashPassword(req.body.Password);
   Users.findOne({ Username: req.body.Username })
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
  app.put('/users/:name', passport.authenticate('jwt', { session: false }), (req, res) => {
    let hashedPassword = Users.hashPassword(req.body.Password);
    Users.findOneAndUpdate({ Username: req.params.name }, { $set:
      {
        Username: req.body.Username,
        Password: hashedPassword,
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

  //Get one user by Username
  app.get('/users/:name', (req, res) => {
    Users.findOne({Username: req.params.name })
    .then ((user) => { res.status(201).json(user);
})
      .catch((err) => { console.error(err);
    res.status(500).send('Error: ' + err);
    });
  });

  //Add a Fav Movie to a Users List
  app.post('/users/:name/movies/:Id', passport.authenticate('jwt', { session: false }), (req, res) => {
    Users.findOneAndUpdate({ Username: req.params.name  }, {
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

//Delete a Fav Movie by a User
  app.delete('/users/:name/movies/:Id', passport.authenticate('jwt', { session: false }), (req, res) => {
    Users.findOneAndRemove({ Username: req.params.name})
    .then((movie) => {
      if (!movie) {
        res.status(400).send(req.params.Id + ' was not found');
      } else {
        res.status(200).send(req.params.Id + ' was deleted.');
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

//Delete a User
  app.delete('/users/:name', passport.authenticate('jwt', { session: false }), (req, res) => {
    Users.findOneAndRemove({ Username: req.params.name  })
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

