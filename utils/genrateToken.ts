
import { Request, Response } from 'express';
const jwt = require('jsonwebtoken');
import { IUserDocument } from '../Model/user.model';

export const genrateToken = async (res: Response, UserDocument: IUserDocument) => {
    try {
        const token = jwt.sign({ userID: UserDocument._id }, process.env.JWT_SECRET_KEY!,
            {
                expiresIn: "1d"
            }
        );
        return token
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ message: error.message })
    }
}