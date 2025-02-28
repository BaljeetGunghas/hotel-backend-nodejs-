
import { Request, Response } from 'express';
import { IUserDocument } from '../Model/user.model';
const jwt = require('jsonwebtoken');

export const genrateToken = async (res: Response, UserDocument: IUserDocument) => {
    try {
        const token = jwt.sign({ userID: UserDocument._id }, process.env.JWT_SECRET_KEY!,
            {
                expiresIn: "1d" // expires in 24 hours
            }
        );
        return token
    } catch (error) {
        if (error instanceof Error) {
            console.log(error.message)
            res.status(500).json({ message: error.message })
        } else {
            console.log(String(error))
            res.status(500).json({ message: String(error) })
        }
    }
}