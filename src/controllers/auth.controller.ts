import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/user.model';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { emailOrUsername, password } = req.body;
    console.log('Login attempt:', { emailOrUsername });

    if (!emailOrUsername || !password) {
      res.status(400).json({ message: 'Email/Username and password are required' });
      return;
    }

    const user = await User.findOne({
      $or: [{ email: emailOrUsername }, { username: emailOrUsername }]
    });
    
    if (!user) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    console.log('Login successful:', { userId: user._id, role: user.role });
    res.json({ token, userId: user._id, role: user.role });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, email, password, role } = req.body;
    console.log('Registration attempt:', { username, email, role });

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      res.status(400).json({ message: 'User already exists' });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({
      username,
      email,
      password: hashedPassword,
      role: role || 'user'
    });

    const savedUser = await user.save();
    
    console.log('User registered:', { 
      userId: savedUser._id, 
      username: savedUser.username, 
      email: savedUser.email, 
      role: savedUser.role
    });

    const token = jwt.sign(
      { userId: savedUser._id, role: savedUser.role },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(201).json({ token, userId: savedUser._id, role: savedUser.role });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Error registering user' });
  }
};