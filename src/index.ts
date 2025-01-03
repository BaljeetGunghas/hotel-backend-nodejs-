import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser = require('cookie-parser');
import bodyParser = require('body-parser');
import { connectdb } from './db/connection';
import userroutes from './routes/user.routes';
import hotelroutes from './routes/hotel.routes';
import hotelRooms from './routes/room.routes';



dotenv.config();
const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));
const PORT = process.env.PORT || 3000;
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// api routes

app.get('/', (req, res) => {
  res.send('Production App Started!');
});
app.use('/api/v1/user', userroutes);  // user routes
app.use('/api/v1/hotel', hotelroutes); // hotel routes
app.use('/api/v1/hotel-room', hotelRooms); // hotel routes


// start the server
app.listen(PORT, async () => {
  await connectdb();
  console.log(`Server is running on http://localhost:${PORT}`);
});