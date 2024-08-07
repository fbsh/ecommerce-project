import { Request, Response } from 'express';
import Review, { IReview } from '../models/review.model';

export const createReview = async (req: Request, res: Response): Promise<void> => {
  try {
    const { rating, comment, productId } = req.body;
    const review: IReview = new Review({
      user: req.userId,
      product: productId,
      rating,
      comment
    });
    await review.save();
    res.status(201).json(review);
  } catch (error) {
    res.status(400).json({ message: 'Error creating review', error });
  }
};

export const getProductReviews = async (req: Request, res: Response): Promise<void> => {
  try {
    const reviews = await Review.find({ product: req.params.productId }).populate('user', 'username');
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching reviews', error });
  }
};