/*********************************************************************************
*  WEB422 – Assignment 1
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  
*  No part of this assignment has been copied manually or electronically from any other source
*  (including web sites) or distributed to other students.
* 
*  Name: Ali Keshavarzi Student ID: 138245220 Date: 1/19/2024
*  Cyclic Link: https://friendly-lime-belt.cyclic.app/ 
*  Github Link: https://github.com/XxmangreatxX/NewMovies
********************************************************************************/ 

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const MoviesDB = require('./MoviesDB.js');

dotenv.config();

const app = express();
const HTTP_PORT = process.env.HTTP_PORT || 3000;

app.use(cors());
app.use(express.json());

const db = new MoviesDB();

db.initialize(process.env.MONGODB_CONN_STRING)
  .then(() => {
    console.log('Connected to MongoDB');
    app.get('/', (req, res) => {
      res.json({ message: 'API Listening' });
    });

    app.post('/api/movies', async (req, res) => {
      try {
        const newMovie = await db.addNewMovie(req.body);
        res.status(201).json(newMovie);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    });

    app.get('/api/movies', async (req, res) => {
      try {
        const page = req.query.page || 1;
        const perPage = req.query.perPage || 10;
        const title = req.query.title || null;
        const movies = await db.getAllMovies(page, perPage, title);
        res.json(movies);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    });

    app.get('/api/movies/:id', async (req, res) => {
      try {
        const movie = await db.getMovieById(req.params.id);
        if (movie) {
          res.json(movie);
        } else {
          res.status(404).json({ error: 'Movie not found' });
        }
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    });

    app.put('/api/movies/:id', async (req, res) => {
      try {
        const updatedMovie = await db.updateMovieById(req.body, req.params.id);
        if (updatedMovie) {
          res.json(updatedMovie);
        } else {
          res.status(404).json({ error: 'Movie not found' });
        }
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    });

    app.delete('/api/movies/:id', async (req, res) => {
      try {
        const result = await db.deleteMovieById(req.params.id);
        if (result) {
          res.status(204).send();
        } else {
          res.status(404).json({ error: 'Movie not found' });
        }
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    });

    app.listen(HTTP_PORT, () => {
      console.log(`Server listening on port: ${HTTP_PORT}`);
    });
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
  });
