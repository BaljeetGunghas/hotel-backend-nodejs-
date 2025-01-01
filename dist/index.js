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
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(bodyParser.json({ limit: '10mb' }));
const PORT = process.env.PORT || 3000;
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
app.listen(PORT, () => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, connection_1.connectdb)();
    console.log(`Server is running on http://localhost:${PORT}`);
}));
