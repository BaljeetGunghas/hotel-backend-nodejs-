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
Object.defineProperty(exports, "__esModule", { value: true });
exports.genrateToken = void 0;
const jwt = require('jsonwebtoken');
const genrateToken = (res, UserDocument) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = jwt.sign({ userID: UserDocument._id }, process.env.JWT_SECRET_KEY, {
            expiresIn: "1d" // expires in 24 hours
        });
        return token;
    }
    catch (error) {
        if (error instanceof Error) {
            console.log(error.message);
            res.status(500).json({ message: error.message });
        }
        else {
            console.log(String(error));
            res.status(500).json({ message: String(error) });
        }
    }
});
exports.genrateToken = genrateToken;
