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

app.get('/movies', (req, res) => {
    res.json(topMovies);
  });

let topMovies = [
    {
      title: 'The Matrix',
      direktor: 'Lana Wachowski'
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
    res.sendFile('public/documentation.html', { root: __dirname });
  });
  app.use('/documentation', express.static('public'));

  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
  });


  // listen for requests
  app.listen(8080, () => {
    console.log('Your app is listening on port 8080.');
  });