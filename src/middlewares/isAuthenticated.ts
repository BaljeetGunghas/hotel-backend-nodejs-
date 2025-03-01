import { NextFunction, Request, Response } from "express";
const jwt = require('jsonwebtoken');
declare global {
    namespace Express {
        interface Request {
            userID: string;
        }
    }
}



export const isAutheticated = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

        if (!token) {
            res.status(200).json({ message: "Unauthorized", output: -401, jsonResponse: null });
            return;
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY) as any;
        if (!decoded) {
            res.status(200).json({ message: "Unauthorized", output: -401, jsonResponse: null });
            return;
        };
        req.userID = decoded.userID;

        next();
    } catch (error) {
        res.status(200).json({ message: "Unauthorized", output: -401, jsonResponse: null });
    }

}