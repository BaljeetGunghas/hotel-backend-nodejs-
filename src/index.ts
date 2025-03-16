import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser = require('cookie-parser');
import bodyParser = require('body-parser');
import { connectdb } from './db/connection';
import userroutes from './routes/user.routes';
import hotelroutes from './routes/hotel.routes';
import hotelRooms from './routes/room.routes';
import host from './routes/host.routes';
import booking from './routes/booking.routes'
import delteImage from './routes/deleteImage';
const evn = "../.env";

dotenv.config({ path: evn });

const app = express();
const allowedOrigins = [
  'https://velvet-haven.netlify.app', // ✅ Remove trailing slash
  /^http:\/\/localhost:\d+$/ // ✅ Allow all localhost ports
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.some((o) => o instanceof RegExp ? o.test(origin) : o === origin)) {
        callback(null, true);
      } else {
        console.error(`Blocked by CORS: ${origin}`);
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true, // ✅ Allow cookies/auth headers
  })
);

connectdb().catch((err) => console.error("DB Connection Error:", err));


app.use(bodyParser.json({ limit: '10mb' }));

// Check if environment variables are loaded correctly
if (!process.env.PORT) {
  console.error('Error: PORT environment variable is not set.');
  process.exit(1);
}

const PORT = process.env.PORT || 8080;

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
app.use('/api/v1/host', host); // hotel routes
app.use('/api/v1/booking', booking);
app.use('/api/v1/delete-image', delteImage); //   delete image routes

// start the server
app.listen(PORT, async () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});