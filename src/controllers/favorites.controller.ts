import { Request, Response } from 'express';
import mongoose from 'mongoose';
import User from '../models/user.model';
import Product from '../models/product.model';

export const getFavorites = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.userId).populate('favorites');
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    res.json(user.favorites);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching favorites' });
  }
};

export const toggleFavorite = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    const productId = new mongoose.Types.ObjectId(req.params.productId);
    const product = await Product.findById(productId);
    if (!product) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }

    const index = user.favorites.findIndex(id => id.equals(productId));
    if (index > -1) {
      user.favorites.splice(index, 1);
    } else {
      user.favorites.push(productId);
    }

    await user.save();
    res.json({ message: 'Favorites updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating favorites' });
  }
};