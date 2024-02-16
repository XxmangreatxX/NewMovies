const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const MoviesDB = require("./modules/moviesDB.js");
const path = require('path');

require('dotenv').config();

const db = new MoviesDB();

const app = express();
// Add support for incoming JSON entities
app.use(bodyParser.json());
app.use(express.json());
// Add cors
app.use(cors());
app.use(express.static('main'));
app.use("/main/js/", express.static(__dirname + '/main/js'));

const HTTP_PORT = process.env.PORT || 8080;
// Or use some other port number that you like better

//envoking DB
db.initialize(process.env.MONGODB_CONN_STRING).then(()=>{
  app.listen(HTTP_PORT, ()=>{
    console.log(`server listening on: ${HTTP_PORT}`);
  });
}).catch((err)=>{
  console.log(err);
});

// Add new "Movie" document to the collection and return newly created movie object
// return newly created movie object / fail message error
app.post('/api/movies', (req,res) =>{
  db.addNewMovie(req.body)
  .then((data) => {
      res.status(201).json(data);
  })
  .catch((err) => {
    res.status(400).json(err);
  });
});

// This route will accept numeric query parameters "page", "perPage" and "title" ie:/api/movies?page=1&perPage=5&title=The Avengers
//return all "Movie" objects for a specific "page" optional filtering by "title"
app.get('/api/movies', (req,res) =>{
  if (req.query.title){
    db.getAllMovies(req.query.page, req.query.perPage, req.query.title)
    .then(movies => {
        res.status(200).json(movies);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
  } 
  else {
    db.getAllMovies(req.query.page, req.query.perPage)
    .then(movies => {
        res.status(200).json(movies);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
  }
});

// This route will accept a parameter that represents the id of the desired object ie: /api/movies/573a1391f29313caabcd956e
// return a specific "Movie" object to client
app.get('/api/movies/:id',function(req,res) {
  db.getMovieById(req.params.id)
  .then((movies) => {
      res.status(200).json(movies);
  })
  .catch((err) => {
    res.status(400).json(err);
  });
});

// This route accepts a parameter that represents the id of desired movie object and read the contents of the request body.
// will use the values to update a specific "Movie" document in the collection and return a success / fail message error to client 
app.put('/api/movies/:id', (req,res) =>{
  db.updateMovieById(req.body, req.params.id)
  .then((movie) => {
      res.status(200).json(movie);
  })
  .catch((err) => {
    res.status(500).json(err);
  });
});
//This route must accept a route parameter that represents the id of desired movie objects
// will use this value to delete a specific "Movie" document
app.delete('/api/movies/:id', (req,res) =>{
  db.deleteMovieById(req.params.id)
  .then(() => {
    res.status(200).json('sale ${req.params.id} successfully deleted');
  })
  .catch((err) => {
    res.status(404).json(err);
  });
});

// Resource not found (this should be at the end)
app.use((req, res) => {
  res.status(404).send('Resource not found');
});
