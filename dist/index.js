"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
const host_routes_1 = __importDefault(require("./routes/host.routes"));
const deleteImage_1 = __importDefault(require("./routes/deleteImage"));
const evn = "../.env";
dotenv_1.default.config({ path: evn });
const app = (0, express_1.default)();
const allowedOrigins = [
    'https://velvet-haven.netlify.app', // ✅ Remove trailing slash
    /^http:\/\/localhost:\d+$/ // ✅ Allow all localhost ports
];
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.some((o) => o instanceof RegExp ? o.test(origin) : o === origin)) {
            callback(null, true);
        }
        else {
            console.error(`Blocked by CORS: ${origin}`);
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true, // ✅ Allow cookies/auth headers
}));
(0, connection_1.connectdb)().catch((err) => console.error("DB Connection Error:", err));
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
app.use('/api/v1/host', host_routes_1.default); // hotel routes
app.use('/api/v1/delete-image', deleteImage_1.default); //   delete image routes
// start the server
app.listen(PORT, () => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`Server is running on http://localhost:${PORT}`);
}));
