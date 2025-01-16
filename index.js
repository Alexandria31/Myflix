const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(morgan("combined")); // Use Morgan for logging
app.use(bodyParser.json());

// Sample movie data
let movies = [
  {
    id: 1,
    title: "Inception",
    director: "Christopher Nolan",
    year: 2010,
    genre: "Sci-Fi",
  },
  {
    id: 2,
    title: "The Godfather",
    director: "Francis Ford Coppola",
    year: 1972,
    genre: "Crime",
  },
  {
    id: 3,
    title: "The Dark Knight",
    director: "Christopher Nolan",
    year: 2008,
    genre: "Action",
  },
];

// Routes

// Get all movies
app.get("/movies", (req, res) => {
  res.status(200).json(movies);
});

// Get a movie by ID
app.get("/movies/:id", (req, res) => {
  const movie = movies.find((m) => m.id === parseInt(req.params.id));
  if (!movie) return res.status(404).send("Movie not found");
  res.status(200).json(movie);
});

// Create a new movie
app.post("/movies", (req, res) => {
  const newMovie = {
    id: movies.length + 1,
    title: req.body.title,
    director: req.body.director,
    year: req.body.year,
    genre: req.body.genre,
  };
  movies.push(newMovie);
  res.status(201).json(newMovie);
});

// Update a movie by ID
app.patch("/movies/:id", (req, res) => {
  const movie = movies.find((m) => m.id === parseInt(req.params.id));
  if (!movie) return res.status(404).send("Movie not found");

  if (req.body.title) movie.title = req.body.title;
  if (req.body.director) movie.director = req.body.director;
  if (req.body.year) movie.year = req.body.year;
  if (req.body.genre) movie.genre = req.body.genre;

  res.status(200).json(movie);
});

// Delete a movie by ID
app.delete("/movies/:id", (req, res) => {
  const movieIndex = movies.findIndex((m) => m.id === parseInt(req.params.id));
  if (movieIndex === -1) return res.status(404).send("Movie not found");

  const deletedMovie = movies.splice(movieIndex, 1);
  res.status(200).json(deletedMovie);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
