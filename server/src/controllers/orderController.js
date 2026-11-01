import { Order } from '../models/Order.js';

export const createOrder = async (req, res) => {
  try {
    const { items, totalAmount, shippingAddress, paymentMethod } = req.body;

    if (!items || items.length === 0 || !totalAmount || !shippingAddress) {
      return res.status(400).json({ message: 'Missing order items, total amount, or shipping address' });
    }

    const order = await Order.create({
      user: req.user._id,
      items,
      totalAmount: Number(totalAmount),
      shippingAddress,
      paymentMethod: paymentMethod || 'COD',
      status: 'Placed'
    });

    res.status(201).json({ message: 'Order placed successfully', order });
  } catch (error) {
    res.status(500).json({ message: 'Error placing order', error: error.message });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching orders' });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('user', 'name email mobile').sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching all orders' });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.status = status || order.status;
    await order.save();

    res.json({ message: 'Order status updated', order });
  } catch (error) {
    res.status(500).json({ message: 'Error updating order status' });
  }
};
