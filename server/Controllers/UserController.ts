import mongoose from 'mongoose';
import User from '../models/User';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const SECRET_KEY = process.env.JWT_SECRET || '';
const test = async(req: any, res: any) => {
    res.send('Hi! Tushar');
    return;
}

const signup = async (req: any, res: any) => {
    const { name, email, password } = req.body;
    const hashedPassword = await bcryptjs.hash(password, 10);
    const userExists = await User.findOne({ email });
    if (userExists) {
        res.status(400).send({ message: 'User already exists try logging in' });
        return;
    }
    const user = new User({
        name,
        email,
        password: hashedPassword
    });

    try {
        await user.save();
        const token = jwt.sign({
            _id: user._id
        }, SECRET_KEY);
        res.status(201).send({ message: 'User created successfully' , token , user });

    } catch (error) {
        res.status(500).send({ message: 'Error creating user' });
    }
    
}

const login = async (req: any, res: any) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || user === null) {
        res.status(400).send({ message: 'Invalid email or password' });
        return;
    }

    const isMatch = await bcryptjs.compare(password, user.password);
    if (!isMatch) {
        res.status(400).send({ message: 'Invalid email or password' });
        return;
    }

    const token = jwt.sign({ _id: user._id }, SECRET_KEY);
    res.status(200).send({ message: 'Login successful', token, user });
    return;
}

export default { test , signup, login };