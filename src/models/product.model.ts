import mongoose, { Document, Schema } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  brand: string;
  category: string;
  image: string;
  inStock: boolean;
}

const ProductSchema: Schema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  brand: { type: String, required: true },
  category: { type: String, required: true },
  image: { type: String, required: true },
  inStock: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model<IProduct>('Product', ProductSchema);