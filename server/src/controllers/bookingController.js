import { Booking } from '../models/Booking.js';

export const createBooking = async (req, res) => {
  try {
    const { bookingType, itemTitle, destination, startDate, guests, totalPrice } = req.body;

    if (!bookingType || !itemTitle || !startDate || !totalPrice) {
      return res.status(400).json({ message: 'Missing required booking details' });
    }

    const booking = await Booking.create({
      user: req.user._id,
      bookingType,
      itemTitle,
      destination: destination || '',
      startDate,
      guests: Number(guests) || 1,
      totalPrice: Number(totalPrice),
      status: 'Confirmed'
    });

    res.status(201).json({ message: 'Booking confirmed', booking });
  } catch (error) {
    res.status(500).json({ message: 'Error creating booking', error: error.message });
  }
};

export const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching your bookings' });
  }
};

export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().populate('user', 'name email mobile').sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching all bookings' });
  }
};

export const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Only booking owner or admin can cancel
    if (booking.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to cancel this booking' });
    }

    booking.status = 'Cancelled';
    await booking.save();

    res.json({ message: 'Booking cancelled successfully', booking });
  } catch (error) {
    res.status(500).json({ message: 'Error cancelling booking' });
  }
};
