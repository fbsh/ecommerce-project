import mongoose from 'mongoose';
import { faker } from '@faker-js/faker';
import dotenv from 'dotenv';
import Product from '../models/product.model';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce';

const brands = ['Apple', 'Samsung', 'Sony', 'LG', 'Panasonic'];
const productTypes = ['Electronics', 'Appliances', 'Accessories'];

async function seedDatabase() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing products
    const deleteResult = await Product.deleteMany({});
    console.log(`Cleared ${deleteResult.deletedCount} existing products`);

    const products = [];

    for (let i = 0; i < 30; i++) {
      const product = new Product({
        name: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        price: parseFloat(faker.commerce.price()),
        brand: faker.helpers.arrayElement(brands),
        category: faker.helpers.arrayElement(productTypes),
        image: faker.image.url(),
        inStock: faker.datatype.boolean()
      });
      products.push(product);
    }

    const insertResult = await Product.insertMany(products);
    console.log(`Seeded ${insertResult.length} products`);

    console.log('Database seeding completed successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

seedDatabase();