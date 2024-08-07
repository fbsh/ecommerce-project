# TypeScript Best Practices for E-commerce Project

## 1. Understanding TypeScript and JavaScript Relationship

- **Why**: Crucial for integrating TypeScript with Express and MongoDB in your e-commerce backend.
- **Example**:
  ```typescript
  import express from 'express';
  import mongoose from 'mongoose';

  const app: express.Application = express();
  mongoose.connect('mongodb://localhost:27017/ecommerce');
  ```

## 2. TypeScript Compiler Options

- **Why**: Ensures consistent TypeScript compilation across your e-commerce project.
- **Example** (`tsconfig.json`):
  ```json
  {
    "compilerOptions": {
      "target": "ES2020",
      "module": "commonjs",
      "strict": true,
      "esModuleInterop": true,
      "outDir": "./dist"
    },
    "include": ["src/**/*"]
  }
  ```

## 3. Structural Typing for Product, User, and Brand

- **Why**: Defines clear interfaces for your main e-commerce entities.
- **Example**:
  ```typescript
  interface Product {
    id: string;
    name: string;
    price: number;
    brand: string;
    type: string;
  }

  interface User {
    id: string;
    username: string;
    email: string;
    favorites: string[]; // Array of product IDs
  }

  interface Brand {
    id: string;
    name: string;
    products: string[]; // Array of product IDs
  }
  ```

## 4. Limiting Use of 'any'

- **Why**: Improves type safety in your e-commerce functions, especially for product and user operations.
- **Example**:
  ```typescript
  // Instead of:
  function getProduct(id: any): any {
    // ...
  }

  // Use:
  function getProduct(id: string): Promise<Product | null> {
    // ...
  }
  ```

## 5. Using Editor to Explore Types

- **Why**: Enhances development experience when working with Express types in your e-commerce routes.
- **Example**:
  ```typescript
  import { Request, Response } from 'express';

  app.get('/products', (req: Request, res: Response) => {
    // Hover over 'req' and 'res' to explore their types
  });
  ```

## 6. Thinking of Types as Sets of Values

- **Why**: Useful for defining product types or user roles in your e-commerce system.
- **Example**:
  ```typescript
  type ProductType = 'Electronics' | 'Clothing' | 'Books';
  type UserRole = 'User' | 'Admin';

  interface User {
    // ...
    role: UserRole;
  }
  ```

## 7. Preferring Type Annotations to Assertions

- **Why**: Ensures type safety when working with MongoDB data in your e-commerce backend.
- **Example**:
  ```typescript
  import { Document } from 'mongoose';

  interface UserDocument extends User, Document {}

  const UserModel = mongoose.model<UserDocument>('User', userSchema);

  async function getUser(id: string): Promise<User | null> {
    const user = await UserModel.findById(id).lean();
    return user as User | null;
  }
  ```

## 8. Applying Types to Entire Function Expressions

- **Why**: Improves type safety in Express route handlers and middleware for authentication.
- **Example**:
  ```typescript
  type RequestHandler = (req: Request, res: Response, next: NextFunction) => void;

  const authenticateUser: RequestHandler = (req, res, next) => {
    // Implementation
  };
  ```

## 9. Understanding Differences Between 'type' and 'interface'

- **Why**: Helps in choosing the right construct for your e-commerce data models and utility types.
- **Example**:
  ```typescript
  interface Product {
    // ... (as defined earlier)
  }

  type ProductFilter = {
    brand?: string;
    type?: ProductType;
    minPrice?: number;
    maxPrice?: number;
  };
  ```

## 10. Using 'readonly'

- **Why**: Prevents accidental modifications of critical user or product properties.
- **Example**:
  ```typescript
  interface User {
    readonly id: string;
    readonly email: string;
    username: string;
    favorites: string[];
  }
  ```

## 11. Type Operations and Generic Types

- **Why**: Useful for creating reusable types for pagination or filtering in your product catalog.
- **Example**:
  ```typescript
  type Paginated<T> = {
    items: T[];
    total: number;
    page: number;
    pageSize: number;
  };

  type PaginatedProducts = Paginated<Product>;

  function getPaginatedProducts(page: number, pageSize: number): Promise<PaginatedProducts> {
    // Implementation
  }
  ```

## 12. More Precise Alternatives to Index Signatures

- **Why**: Ensures type safety in your product and user interfaces.
- **Example**:
  ```typescript
  // Instead of:
  interface BadProduct {
    [key: string]: string | number;
  }

  // Use:
  interface GoodProduct {
    id: string;
    name: string;
    price: number;
    brand: string;
    type: ProductType;
  }
  ```

## 13. Type Inference for Local Variables

- **Why**: Reduces clutter and improves readability in your e-commerce functions.
- **Example**:
  ```typescript
  // Good: Let TypeScript infer the type
  const products = await fetchProducts();

  // Avoid: Unnecessary type annotation
  const productCount: number = products.length;
  ```

## 14. Discriminated Unions for User Types

- **Why**: Safely handle different user types (e.g., regular users vs admins) in your e-commerce system.
- **Example**:
  ```typescript
  type User = 
    | { kind: 'regular'; username: string; favorites: string[] }
    | { kind: 'admin'; username: string; canViewAllAccounts: true };

  function handleUser(user: User) {
    if (user.kind === 'admin') {
      console.log(user.canViewAllAccounts);
    } else {
      console.log(user.favorites);
    }
  }
  ```

## 15. Async/Await for Database Operations and API Calls

- **Why**: Improves readability and type flow in asynchronous operations common in e-commerce backends.
- **Example**:
  ```typescript
  async function fetchProducts(page: number): Promise<Product[]> {
    const response = await fetch(`/api/products?page=${page}`);
    if (!response.ok) throw new Error('Failed to fetch products');
    return response.json();
  }
  ```

## 16. Creating Objects All at Once

- **Why**: Leverages TypeScript's type inference and ensures all required properties are present for product creation.
- **Example**:
  ```typescript
  function createProduct(data: Omit<Product, 'id'>): Product {
    return {
      ...data,
      id: generateId() // Assume this function exists
    };
  }

  const newProduct = createProduct({
    name: 'Cool Gadget',
    brand: 'TechBrand',
    type: 'Electronics',
    price: 99.99,
    imageUrl: '/images/cool-gadget.jpg'
  });
  ```

## 17. Use Different Variables for Different Types

- **Why**: Improves type safety when dealing with raw and processed data, like user passwords.
- **Example**:
  ```typescript
  async function registerUser(formData: { username: string, password: string }) {
    const rawPassword = formData.password;
    const hashedPassword = await hashPassword(rawPassword);
    
    const user: User = {
      username: formData.username,
      passwordHash: hashedPassword,
      favorites: []
    };

    await saveUser(user);
  }
  ```

## 18. Understand Type Narrowing

- **Why**: Helps handle different cases based on types or properties in product actions.
- **Example**:
  ```typescript
  function handleProductAction(product: Product, action: 'view' | 'favorite') {
    if (action === 'favorite') {
      addToFavorites(product);
    } else {
      displayProductDetails(product);
    }
  }
  ```

## 19. Use Functional Constructs for Better Type Flow

- **Why**: Provides cleaner code and better type inference when working with product collections.
- **Example**:
  ```typescript
  function getFavoriteProducts(user: User, allProducts: Product[]): Product[] {
    return allProducts.filter(product => user.favorites.includes(product.id));
  }
  ```

## 20. Leverage Context in Type Inference

- **Why**: Improves type inference in callbacks, useful for sorting products or processing orders.
- **Example**:
  ```typescript
  const sortedProducts = products.sort((a, b) => b.price - a.price);
  // TypeScript infers a and b are of type Product
  ```

## 21. Use Unions of Interfaces for Different Product Types

- **Why**: Allows for more precise modeling of different product types in your e-commerce system.
- **Example**:
  ```typescript
  interface BaseProduct {
    id: string;
    name: string;
    price: number;
  }

  interface ElectronicsProduct extends BaseProduct {
    type: 'electronics';
    voltage: number;
  }

  interface ClothingProduct extends BaseProduct {
    type: 'clothing';
    size: string;
  }

  interface BookProduct extends BaseProduct {
    type: 'books';
    author: string;
  }

  type Product = ElectronicsProduct | ClothingProduct | BookProduct;

  function displayProduct(product: Product) {
    console.log(product.name, product.price);
    if (product.type === 'electronics') {
      console.log(`Voltage: ${product.voltage}V`);
    } else if (product.type === 'clothing') {
      console.log(`Size: ${product.size}`);
    } else {
      console.log(`Author: ${product.author}`);
    }
  }
  ```

## 22. Use More Precise Alternatives to String Types

- **Why**: Prevents accidental assignment of invalid values for product categories or user roles.
- **Example**:
  ```typescript
  type Category = 'Electronics' | 'Clothing' | 'Books' | 'Home & Garden';
  type UserRole = 'Customer' | 'Admin' | 'Support';

  interface Product {
    // ...other properties
    category: Category;
  }

  interface User {
    // ...other properties
    role: UserRole;
  }
  ```

## 23. Use Distinct Types for Special Values

- **Why**: Prevents mixing up different types of IDs in your e-commerce system.
- **Example**:
  ```typescript
  type ProductId = string & { __brand: 'ProductId' };
  type OrderId = string & { __brand: 'OrderId' };

  function getProduct(id: ProductId): Promise<Product> {
    // Implementation
  }

  function getOrder(id: OrderId): Promise<Order> {
    // Implementation
  }

  // Usage
  const productId = '12345' as ProductId;
  const orderId = '67890' as OrderId;

  getProduct(productId); // OK
  getProduct(orderId); // Type error
  ```

## 24. Limit the Use of Optional Properties

- **Why**: Makes it clear which combinations of properties are valid for products or orders.
- **Example**:
  ```typescript
  interface BaseOrder {
    id: OrderId;
    userId: string;
    products: Array<{id: ProductId, quantity: number}>;
  }

  interface UnpaidOrder extends BaseOrder {
    status: 'unpaid';
  }

  interface PaidOrder extends BaseOrder {
    status: 'paid';
    paymentDate: Date;
    paymentMethod: string;
  }

  type Order = UnpaidOrder | PaidOrder;

  function processOrder(order: Order) {
    if (order.status === 'paid') {
      console.log(`Paid on ${order.paymentDate} via ${order.paymentMethod}`);
    }
  }
  ```

## 25. Avoid Repeated Parameters of the Same Type

- **Why**: Improves clarity and reduces errors in functions dealing with product filtering or pagination.
- **Example**:
  ```typescript
  interface ProductFilter {
    minPrice?: number;
    maxPrice?: number;
    category?: Category;
    inStock?: boolean;
  }

  function filterProducts(filter: ProductFilter): Promise<Product[]> {
    // Implementation
  }

  // Usage
  filterProducts({ minPrice: 10, maxPrice: 100, category: 'Electronics', inStock: true });
  ```

## 26. Prefer Unifying Types to Modeling Differences

- **Why**: Simplifies code when dealing with similar types of users or orders.
- **Example**:
  ```typescript
  interface User {
    id: string;
    name: string;
    email: string;
    role: 'customer' | 'admin';
    orderHistory: OrderId[];
    adminPrivileges?: string[];
  }

  function displayUserInfo(user: User) {
    console.log(`${user.name} (${user.email})`);
    if (user.role === 'admin') {
      console.log(`Admin privileges: ${user.adminPrivileges?.join(', ')}`);
    }
  }
  ```

## 27. Use Imprecise Types When Necessary

- **Why**: Allows for flexibility in handling various price formats or currencies.
- **Example**:
  ```typescript
  type Price = number | { amount: number; currency: string };

  function displayPrice(price: Price): string {
    if (typeof price === 'number') {
      return `$${price.toFixed(2)}`;
    } else {
      return `${price.currency} ${price.amount.toFixed(2)}`;
    }
  }

  // Usage
  console.log(displayPrice(19.99)); // "$19.99"
  console.log(displayPrice({ amount: 15.50, currency: '€' })); // "€ 15.50"
  ```

## 28. Name Types Using Domain-Specific Language

- **Why**: Makes your code more self-documenting and easier to understand in the context of e-commerce.
- **Example**:
  ```typescript
  type ProductID = string;
  type OrderID = string;
  type CustomerID = string;

  interface Order {
    id: OrderID;
    customerID: CustomerID;
    products: Array<{productID: ProductID, quantity: number}>;
    totalAmount: Price;
    status: OrderStatus;
  }

  type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  ```

## 29. Generate Types from Database Schemas

- **Why**: Ensures alignment between your TypeScript types and MongoDB schemas.
- **Example**:
  ```typescript
  import { Schema, model, Document } from 'mongoose';

  const ProductSchema = new Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, enum: ['Electronics', 'Clothing', 'Books', 'Home & Garden'] },
    inStock: { type: Boolean, default: true }
  });

  export interface IProduct extends Document {
    name: string;
    price: number;
    category: 'Electronics' | 'Clothing' | 'Books' | 'Home & Garden';
    inStock: boolean;
  }

  export const Product = model<IProduct>('Product', ProductSchema);
  ```

## 30. Use Mapped Types for API Responses

- **Why**: Ensures type safety when working with API responses in your e-commerce frontend.
- **Example**:
  ```typescript
  type ApiResponse<T> = {
    data: T;
    status: 'success' | 'error';
    message: string;
  };

  type ProductResponse = ApiResponse<Product>;
  type OrderResponse = ApiResponse<Order>;

  async function fetchProduct(id: ProductID): Promise<ProductResponse> {
    const response = await fetch(`/api/products/${id}`);
    return response.json();
  }
  ```
