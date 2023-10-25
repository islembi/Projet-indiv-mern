const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const port = 8080;

// Connexion à la base de données MongoDB
mongoose.connect('mongodb+srv://ibenothmen:Azerty270797@cluster0.8ngcvzx.mongodb.net/Movies', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => {
    console.log('Connexion à la base de données "Movies" réussie');
  })
  .catch(err => {
    console.error('Erreur de connexion à la base de données "Movies":', err);
  });

app.use(express.json());
app.use(cors());

const Movie = mongoose.model('Movie', new mongoose.Schema({
  title: String,
  year: Number,
  director:String,
  actors: String,
  posterUrl: String,
  
}),"Movie");

// Routes pour le CRUD

// Afficher tous les films
app.get('/api/movies', async (req, res) => {
  try {
    const movies = await Movie.find();
    res.json(movies);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur lors de la récupération des films' });
  }
});

// Ajouter un film
app.post('/api/movies', async (req, res) => {
  const { title, year,director,actors, posterUrl } = req.body;

  try {
    const newMovie = new Movie({ title, year,director,actors, posterUrl });
    await newMovie.save();
    res.json(newMovie);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur lors de l\'ajout du film' });
  }
});
// Supprimer un film (Delete)
app.delete('/api/movies/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedMovie = await Movie.findByIdAndRemove(id);

    if (!deletedMovie) {
      return res.status(404).json({ error: 'Film non trouvé' });
    }

    res.json({ message: 'Film supprimé avec succès' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur lors de la suppression du film' });
  }
});
// Modifier un film (Update)
app.put('/api/movies/:id', async (req, res) => {
  const { id } = req.params;
  const { title, year, director, actors, posterUrl } = req.body;

  try {
    const updatedMovie = await Movie.findByIdAndUpdate(
      id,
      { title, year, director, actors, posterUrl },
      { new: true }
    );

    if (!updatedMovie) {
      return res.status(404).json({ error: 'Film non trouvé' });
    }

    res.json(updatedMovie);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur lors de la modification du film' });
  }
});



app.listen(port, () => {
  console.log(`Serveur Node.js écoutant sur le port ${port}`);
});
