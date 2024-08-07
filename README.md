# E-commerce Project

## Project Overview
The goal was to build a simplified e-commerce website focusing on user authentication, product browsing, and favorites functionality.

## Completed Features

### Backend
- [x] Node.js Express server implemented
- [x] MongoDB with Mongoose integration
- [x] MVC architecture followed

### Frontend
- [x] Plain HTML, CSS, JS implemented
- [ ] Bootstrap/Tailwind CSS integration 

### User Authentication
- [x] Registration functionality
- [x] Login functionality
- [x] JWT-based authentication

### Product Management
- [x] Product model created
- [x] Product listing with pagination
- [x] Product details page
- [x] Related products display
- [x] Database seeded with 30 fake products, 5 brands, and 3 product types

### Filtering
- [x] Filter products by brand and category

### Favorites
- [x] Add/remove favorites functionality
- [x] Display user's favorites

### Admin Functionality
- [x] Basic admin dashboard
- [x] View all user accounts

## Pending Features

### Frontend Enhancements
- [ ] Implement client-side input validation
- [ ] Improve error handling and display

### User Experience
- [ ] Implement unsupported route redirection
- [ ] Enhance UI/UX for better user interaction

### Admin Functionality
- [ ] Implement user management (edit/delete users)
- [ ] Add product management for admins (add/edit/delete products)

### Security Enhancements
- [ ] Implement more robust server-side input validation
- [ ] Enhance error handling with specific HTTP status codes

### Testing
- [ ] Implement unit tests
- [ ] Implement integration tests

## Setup Instructions

1. Clone the repository:
   ```
   git clone https://github.com/fbsh/ecommerce-project.git
   cd ecommerce-project
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory with the following content:
   ```
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/ecommerce
   JWT_SECRET=your_jwt_secret
   ```
   Replace `mongodb://localhost:27017/ecommerce` with your MongoDB connection string if different.

4. Seed the database:
   ```
   npm run seed
   ```
   This will populate the database with 30 fake products across 5 brands and 3 product types.

5. Start the development server:
   ```
   npm run dev
   ```

6. Access the application:
   Open a web browser and navigate to `http://localhost:3000`

## Available Scripts
- `npm run dev`: Start the development server with hot-reloading
- `npm start`: Start the production server
- `npm run build`: Build the TypeScript files
- `npm run seed`: Seed the database with fake data

## Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

## License
[MIT](https://choosealicense.com/licenses/mit/)