import { Request, Response } from 'express';
import Order, { IOrder } from '../models/order.model';
import Cart from '../models/cart.model';
import Product from '../models/product.model';

export const createOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const { shippingAddress } = req.body;
    const cart = await Cart.findOne({ user: req.userId }).populate('items.product');
    
    if (!cart || cart.items.length === 0) {
      res.status(400).json({ message: 'Cart is empty' });
      return;
    }

    const orderItems = cart.items.map(item => ({
      product: item.product._id,
      quantity: item.quantity,
      price: (item.product as any).price
    }));

    const totalAmount = orderItems.reduce((total, item) => total + item.price * item.quantity, 0);

    const order = new Order({
      user: req.userId,
      items: orderItems,
      totalAmount,
      shippingAddress,
      status: 'pending'
    });

    await order.save();

    // Clear the cart
    cart.items = [];
    await cart.save();

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: 'Error creating order', error });
  }
};

export const getUserOrders = async (req: Request, res: Response): Promise<void> => {
  try {
    const orders = await Order.find({ user: req.userId }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching orders', error });
  }
};

export const getOrderById = async (req: Request, res: Response): Promise<void> => {
  try {
    const order = await Order.findById(req.params.id).populate('items.product');
    if (!order) {
      res.status(404).json({ message: 'Order not found' });
      return;
    }
    if (order.user.toString() !== req.userId && (req as any).userRole !== 'admin') {
      res.status(403).json({ message: 'Not authorized to view this order' });
      return;
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching order', error });
  }
};

export const updateOrderStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) {
      res.status(404).json({ message: 'Order not found' });
      return;
    }
    if ((req as any).userRole !== 'admin') {
      res.status(403).json({ message: 'Not authorized to update order status' });
      return;
    }
    order.status = status;
    await order.save();
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Error updating order status', error });
  }
};