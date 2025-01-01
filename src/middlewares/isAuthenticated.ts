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
        const token = req.cookies.token;

        if (!token) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY) as any;
        if (!decoded) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        };
        req.userID = decoded.userID;

        next();
    } catch (error) {
        res.status(401).send({ message: 'Please authenticate.' });
    }

}