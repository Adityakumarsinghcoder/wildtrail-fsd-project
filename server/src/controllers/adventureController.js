import { Adventure } from '../models/Adventure.js';

export const getAdventures = async (req, res) => {
  try {
    const { destination, sport, difficulty } = req.query;
    let query = {};

    if (destination) {
      query.destination = new RegExp(destination, 'i');
    }
    if (sport) {
      query.sport = new RegExp(sport, 'i');
    }
    if (difficulty) {
      query.difficulty = difficulty;
    }

    const adventures = await Adventure.find(query).sort({ createdAt: -1 });
    res.json(adventures);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching adventures', error: error.message });
  }
};

export const getAdventureById = async (req, res) => {
  try {
    const adventure = await Adventure.findById(req.params.id);
    if (!adventure) {
      return res.status(404).json({ message: 'Adventure not found' });
    }
    res.json(adventure);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching adventure details' });
  }
};

export const createAdventure = async (req, res) => {
  try {
    const { title, destination, sport, difficulty, duration, price, image, description, highlights } = req.body;

    if (!title || !destination || !price) {
      return res.status(400).json({ message: 'Title, destination, and price are required' });
    }

    const adventure = await Adventure.create({
      title,
      destination,
      sport: sport || 'Trekking',
      difficulty: difficulty || 'Moderate',
      duration: duration || '3 Days / 2 Nights',
      price: Number(price),
      image: image || 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80',
      description: description || '',
      highlights: highlights || []
    });

    res.status(201).json(adventure);
  } catch (error) {
    res.status(500).json({ message: 'Error creating adventure', error: error.message });
  }
};

export const deleteAdventure = async (req, res) => {
  try {
    const adventure = await Adventure.findByIdAndDelete(req.params.id);
    if (!adventure) {
      return res.status(404).json({ message: 'Adventure not found' });
    }
    res.json({ message: 'Adventure deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting adventure' });
  }
};
