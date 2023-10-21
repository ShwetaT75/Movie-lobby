import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/movie_lobby');

const movieSchema = new mongoose.Schema({
  title: String,
  genre: String,
  rating: Number,
  streamingLink: String,
});

const Movie = mongoose.model('Movie', movieSchema);

// List all movies
app.get('/movies', async (req: Request, res: Response) => {
  try {
    const movies = await Movie.find();
    res.json(movies);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Search for a movie by title or genre
app.get('/movies/search', async (req: Request, res: Response) => {
    const { title, genre } = req.query;

    try {
      const query: any = {};
      if (title) query.title = { $regex: title as string, $options: 'i' };
      if (genre) query.genre = { $regex: genre as string, $options: 'i' };
  
      const movies = await Movie.find(query);
      res.json(movies);
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error'});
    }
});

// Add a new movie to the lobby
app.post('/movies', async (req: Request, res: Response) => {
  const { title, genre, rating, streamingLink } = req.body;
  try {
    const newMovie = new Movie({ title, genre, rating, streamingLink });
    const savedMovie = await newMovie.save();
    res.status(201).json(savedMovie);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Update an existing movie information
app.put('/movies/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, genre, rating, streamingLink } = req.body;
  try {
    const updatedMovie = await Movie.findByIdAndUpdate(
      id,
      { title, genre, rating, streamingLink },
      { new: true }
    );
    res.json(updatedMovie);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Delete a movie from the lobby
app.delete('/movies/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const deletedMovie = await Movie.findByIdAndDelete(id);
    res.json(deletedMovie);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
