import { Stay } from '../models/Stay.js';

export const getStays = async (req, res) => {
  try {
    const { destination, type } = req.query;
    let query = {};

    if (destination) {
      query.destination = new RegExp(destination, 'i');
    }
    if (type) {
      query.type = type;
    }

    const stays = await Stay.find(query).sort({ rating: -1 });
    res.json(stays);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching stays', error: error.message });
  }
};

export const getStayById = async (req, res) => {
  try {
    const stay = await Stay.findById(req.params.id);
    if (!stay) {
      return res.status(404).json({ message: 'Stay not found' });
    }
    res.json(stay);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching stay details' });
  }
};

export const createStay = async (req, res) => {
  try {
    const { name, destination, type, pricePerNight, rating, image, amenities, description } = req.body;

    if (!name || !destination || !pricePerNight) {
      return res.status(400).json({ message: 'Name, destination, and price per night are required' });
    }

    const stay = await Stay.create({
      name,
      destination,
      type: type || 'Resort',
      pricePerNight: Number(pricePerNight),
      rating: Number(rating) || 4.5,
      image: image || 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80',
      amenities: amenities || ['Free Wi-Fi', 'Campfire', 'Hot Water', 'Mountain View'],
      description: description || ''
    });

    res.status(201).json(stay);
  } catch (error) {
    res.status(500).json({ message: 'Error creating stay', error: error.message });
  }
};

export const deleteStay = async (req, res) => {
  try {
    const stay = await Stay.findByIdAndDelete(req.params.id);
    if (!stay) {
      return res.status(404).json({ message: 'Stay not found' });
    }
    res.json({ message: 'Stay deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting stay' });
  }
};
