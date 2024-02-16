const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const MoviesDB = require("./modules/moviesDB.js");
const path = require('path');

require('dotenv').config();

const db = new MoviesDB();

const app = express();
app.use(bodyParser.json());
app.use(express.json());
app.use(cors());
app.use(express.static('main'));
app.use("/main/js/", express.static(__dirname + '/main/js'));

const HTTP_PORT = process.env.PORT || 3000;

db.initialize(process.env.MONGODB_CONN_STRING).then(()=>{
  app.listen(HTTP_PORT, ()=>{
    console.log(`server listening on: ${HTTP_PORT}`);
  });
}).catch((err)=>{
  console.log(err);
});

app.post('/api/movies', (req,res) =>{
  db.addNewMovie(req.body)
  .then((data) => {
      res.status(201).json(data);
  })
  .catch((err) => {
    res.status(400).json(err);
  });
});

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

app.get('/api/movies/:id',function(req,res) {
  db.getMovieById(req.params.id)
  .then((movies) => {
      res.status(200).json(movies);
  })
  .catch((err) => {
    res.status(400).json(err);
  });
});

app.put('/api/movies/:id', (req,res) =>{
  db.updateMovieById(req.body, req.params.id)
  .then((movie) => {
      res.status(200).json(movie);
  })
  .catch((err) => {
    res.status(500).json(err);
  });
});

app.delete('/api/movies/:id', (req,res) =>{
  db.deleteMovieById(req.params.id)
  .then(() => {
    res.status(200).json('sale ${req.params.id} successfully deleted');
  })
  .catch((err) => {
    res.status(404).json(err);
  });
});

app.use((req, res) => {
  res.status(404).send('Resource not found');
});
