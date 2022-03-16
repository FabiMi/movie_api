const express = require('express');
const app = express();
morgan = require('morgan');




app.use(morgan('common'));



app.get('/', (req, res) => {
  res.send('This is my fantastic Movie App');
});

app.get('/secreturl', (req, res) => {
  res.send('This is a secret url with super top-secret content.');
});

//Gets a list of all the movies
app.get('/movies', (req, res) => {
    res.json(topMovies);
  });

  app.get('/movies/:title', (req, res) => {
    res.send('Succesfull GET request returning Data of one Movie');
  });

  app.get('/movies/genre/:title', (req, res) => {
    res.send('Succesfull GET request returning Data of Genre of the Movies');
  });

  app.get('/movies/director/:name', (req, res) => {
    res.send('Succesfull GET request returning Data of a director of a movie');
  });


  app.post('/users', (req, res) => {
    res.send('Succesfull POST request adding a User');
  });

  app.put('/users/:name', (req, res) => {
    res.send('Succesfull PUT request updating userinfo');
  });

  app.post('/users/:name/movies/:title', (req, res) => {
    res.send('Succesfull POST request adding a movie by a user');
  });


    app.delete('/users/:name/movies/:title', (req, res) => {
        res.send('Succesfull DELETE request deleting a movie by a user');
    });

    app.delete('/users/:name', (req, res) => {
        res.send('Succesfull DELETE request deleting user');
    });  


  



/*gets data about a single Movie , by title  
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
  });

 // Deletes a student from our list by ID
app.delete('/movies/:id', (req, res) => {
    let movie = movies.find((movie) => { return  movie.id === req.params.id });
    if (movie) {
        movies = movies.filter((obj) => { return obj.id !== req.params.id });
        res.status(201).send('Movie' + req.params.id + ' was deleted.');
      }
    });
  */


let topMovies = [
    {
      title: 'The Matrix',
      direktor: 'Lana Wachowski',
      id: '1',
      rating: '9/10'
    },
    {
      title: 'Lord of the Rings',
      direktor: 'Peter Jackson'
    },
    {
      title: 'Desperado',
      direktor: 'Robert Rodriguez'
    },

    {
        title: 'Kill Bill',
        direktor: 'Quentin Tarantino'
    },
    {
        title: 'Sin City',
        direktor: 'Frank Miller'
    },
    {
        title: 'The Devil´s Advocate',
        direktor: 'Taylor Hackford'
    },

    {
        title: 'Heat',
        direktor: 'Michael Mann'
    },

    {
        title: 'The Godfather',
        direktor: 'Francis Ford Coppola'
    },

    {
        title: 'Blow',
        direktor: 'Ted Demme'
    },

    {
        title: 'Interview with a Vampire',
        direktor: 'Neil Jordan'
    },

  ];

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