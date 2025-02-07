import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser = require('cookie-parser');
import bodyParser = require('body-parser');
import { connectdb } from './db/connection';
import userroutes from './routes/user.routes';
import hotelroutes from './routes/hotel.routes';
import hotelRooms from './routes/room.routes';
const evn = "../.env";

dotenv.config({ path: evn });

const app = express();
const allowedOrigins = [
  'https://velvet-haven.netlify.app/', // production URL
  /^http:\/\/localhost:\d+$/ // allow any localhost with dynamic ports
];
app.options('*', cors());
app.use(
  cors({
    origin: (origin, callback) => {
      console.log('Request Origin:', origin);  // Debugging log
      if (!origin || allowedOrigins.some((o) => (typeof o === "string" ? o === origin : o.test(origin)))) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true, // Allow cookies & authorization headers
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

// start the server
app.listen(PORT, async () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});