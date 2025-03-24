import { Request } from "express";
const jwt = require('jsonwebtoken');

export const isAutheticatedByPass = async (req: Request) => {
    try {
        let user_id = null;
        const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY) as any;
        if(decoded) {
            user_id = decoded.userID;
        }
        return user_id;
    } catch (error) {
        console.log('error in isAutheticatedByPass', error);
        return null;
    }
}