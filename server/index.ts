import express from 'express';
const app = express();
import cors from 'cors';
import mongoose from 'mongoose';
// find from .env file
import dotenv from 'dotenv';
import UserRoute from './Routes/UserRoute';
import BillRouter from './Routes/BillRoute';
import { domToBlock } from 'blockly/core/xml';

dotenv.config();
const PORT = process.env.PORT;
const URL = process.env.DB_URL;


mongoose.connect(URL || '', )
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error: Error) => {
    console.log('Error connecting to MongoDB:', error.message);
  });

app.use(express.json());
app.use(cors(
  {
    origin: 'http://localhost:5173',
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Origin, X-Requested-With, Content-Type, Accept, Authorization',
    preflightContinue: false,
  }
));


app.use('/user', UserRoute);
app.use('/bill', BillRouter);


app.listen(PORT, () => {
    console.log('Server started on port 3000');
})

