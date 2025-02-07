"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const connection_1 = require("./db/connection");
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const hotel_routes_1 = __importDefault(require("./routes/hotel.routes"));
const room_routes_1 = __importDefault(require("./routes/room.routes"));
const evn = "../.env";
dotenv_1.default.config({ path: evn });
const app = (0, express_1.default)();
const allowedOrigins = [
    'https://velvet-haven.netlify.app/', // production URL
    /^http:\/\/localhost:\d+$/ // allow any localhost with dynamic ports
];
app.options('*', (0, cors_1.default)());
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        console.log('Origin:', origin); // Log the origin for debugging
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
}));
(0, connection_1.connectdb)();
app.use(bodyParser.json({ limit: '10mb' }));
// Check if environment variables are loaded correctly
if (!process.env.PORT) {
    console.error('Error: PORT environment variable is not set.');
    process.exit(1);
}
const PORT = process.env.PORT || 8080;
app.use(express_1.default.json());
app.use(cookieParser());
app.use(express_1.default.urlencoded({ extended: true }));
// api routes
app.get('/', (req, res) => {
    res.send('Production App Started!');
});
app.use('/api/v1/user', user_routes_1.default); // user routes
app.use('/api/v1/hotel', hotel_routes_1.default); // hotel routes
app.use('/api/v1/hotel-room', room_routes_1.default); // hotel routes
// start the server
exports.default = app;
