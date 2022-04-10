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
mongoose.connect('mongodb://localhost:27017/myMovieDB',
{useNewURLParser: true, useUnifiedTopology: true});
app.use(morgan('common'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.get('/', (req, res) => { 
  res.send('This is my fantastic Movie App');
});

app.get('/secreturl', (req, res) => {
  res.send('This is a secret url with super top-secret content.');
});

//Gets a list of all the movies
app.get('/movies', (req, res) => { Movies.find() .then ((users) => {
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
    Movies.findOne({ Title: rq.params.Title})
    .then ((movies) => { res.status(201).json(movies);
})
      .catch((err) => { console.error(err);
    res.status(500).send('Error: ' + err);
    });
  });

//Get Info about a Genre
  app.get('/genre/:title', (req, res) => {
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
  app.get('/movies/director/:name', (req, res) => {
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
  app.post('/users', (req, res) => {
   Users.findOne({ Name: req.body.Name })
    .then((user) => {
      if (user) {
        return res.status(400).send(req.body.Username + 'already exists');
      } else {
        Users
          .create({
            Username: req.body.Username,
            Password: req.body.Password,
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

  //Add a Fav Mopvie to a Users List
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
  app.listen(8090, () => {
    console.log('Your app is listening on port 8090.');
  });