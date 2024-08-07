import { Request, Response } from 'express';
import Cart, { ICart } from '../models/cart.model';
import Product from '../models/product.model';

export const getCart = async (req: Request, res: Response): Promise<void> => {
  try {
    let cart = await Cart.findOne({ user: req.userId }).populate('items.product');
    if (!cart) {
      cart = new Cart({ user: req.userId, items: [] });
      await cart.save();
    }
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching cart', error });
  }
};

export const addToCart = async (req: Request, res: Response): Promise<void> => {
  try {
    const { productId, quantity } = req.body;
    const product = await Product.findById(productId);
    if (!product) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }

    let cart = await Cart.findOne({ user: req.userId });
    if (!cart) {
      cart = new Cart({ user: req.userId, items: [] });
    }

    const cartItemIndex = cart.items.findIndex(item => item.product.toString() === productId);
    if (cartItemIndex > -1) {
      cart.items[cartItemIndex].quantity += quantity;
    } else {
      cart.items.push({ product: productId, quantity });
    }

    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Error adding to cart', error });
  }
};

export const removeFromCart = async (req: Request, res: Response): Promise<void> => {
  try {
    const { productId } = req.params;
    const cart = await Cart.findOne({ user: req.userId });
    if (!cart) {
      res.status(404).json({ message: 'Cart not found' });
      return;
    }

    cart.items = cart.items.filter(item => item.product.toString() !== productId);
    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Error removing from cart', error });
  }
};

export const updateCartItem = async (req: Request, res: Response): Promise<void> => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;
    const cart = await Cart.findOne({ user: req.userId });
    if (!cart) {
      res.status(404).json({ message: 'Cart not found' });
      return;
    }

    const cartItem = cart.items.find(item => item.product.toString() === productId);
    if (!cartItem) {
      res.status(404).json({ message: 'Item not found in cart' });
      return;
    }

    cartItem.quantity = quantity;
    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Error updating cart item', error });
  }
};