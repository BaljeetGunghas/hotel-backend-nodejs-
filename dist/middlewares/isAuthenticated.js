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
exports.isAutheticated = void 0;
const jwt = require('jsonwebtoken');
const isAutheticated = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const token = req.cookies.token || ((_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1]);
        if (!token) {
            res.status(200).json({ message: "Unauthorized", output: -401, jsonResponse: null });
            return;
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        if (!decoded) {
            res.status(200).json({ message: "Unauthorized", output: -401, jsonResponse: null });
            return;
        }
        ;
        req.userID = decoded.userID;
        next();
    }
    catch (error) {
        res.status(200).json({ message: "Unauthorized", output: -401, jsonResponse: null });
    }
});
exports.isAutheticated = isAutheticated;
