import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/product.model';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce';

const brands = ['Apple', 'Samsung', 'Sony', 'LG', 'Panasonic'];
const productTypes = ['Electronics', 'Appliances', 'Accessories'];

const products = [
  { name: "Smartphone X", description: "Latest smartphone with advanced features", price: 999.99, brand: "Apple", category: "Electronics" },
  { name: "4K Smart TV", description: "Ultra HD TV with smart capabilities", price: 1299.99, brand: "Samsung", category: "Electronics" },
  { name: "Wireless Headphones", description: "High-quality wireless headphones", price: 249.99, brand: "Sony", category: "Accessories" },
  { name: "Refrigerator Pro", description: "Energy-efficient refrigerator", price: 1599.99, brand: "LG", category: "Appliances" },
  { name: "Digital Camera", description: "Professional-grade digital camera", price: 799.99, brand: "Panasonic", category: "Electronics" },
  { name: "Tablet Air", description: "Lightweight tablet for productivity", price: 499.99, brand: "Apple", category: "Electronics" },
  { name: "Washing Machine", description: "Front-loading washing machine", price: 699.99, brand: "Samsung", category: "Appliances" },
  { name: "Bluetooth Speaker", description: "Portable Bluetooth speaker", price: 129.99, brand: "Sony", category: "Accessories" },
  { name: "OLED TV", description: "High-end OLED TV", price: 1999.99, brand: "LG", category: "Electronics" },
  { name: "Microwave Oven", description: "Compact microwave oven", price: 99.99, brand: "Panasonic", category: "Appliances" },
  // Add 20 more products here to reach a total of 30
];

// Add 20 more product objects to the 'products' array to reach a total of 30

async function manualSeed() {
  try {
    console.log('Connecting to MongoDB:', MONGODB_URI);
    const conn = await mongoose.connect(MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    console.log('Connected to database:', conn.connection.name);
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing products
    const deleteResult = await Product.deleteMany({});
    console.log(`Cleared ${deleteResult.deletedCount} existing products`);

    // Insert new products
    const insertResult = await Product.insertMany(products.map(product => ({
      ...product,
      image: `https://example.com/images/${product.name.toLowerCase().replace(/ /g, '-')}.jpg`,
      inStock: Math.random() > 0.2 // 80% chance of being in stock
    })));

    console.log(`Seeded ${insertResult.length} products`);
    console.log('Database seeding completed successfully');
    } catch (error) {
    console.error('Error seeding database:', error);
    } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    }
}

manualSeed();