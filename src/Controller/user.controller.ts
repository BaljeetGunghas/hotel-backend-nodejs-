import { Request, Response } from "express";
import { User } from "../Model/user.model";
import * as crypto from "crypto";
import { genrateToken } from "../utils/genrateToken";
import { generateVerificationCode } from "../utils/genrateVerificationCode";
import {
    passwordResetConfirmationEmail,
    sendPasswordResetEmail,
    sendVerificationEmail,
    sendWelcomeEmail,
} from "../mailtrap/email";
const bcrypt = require("bcrypt");

export const signup = async (req: Request, res: Response) => {
    try {
        const { name, email, password, phone_number } = req.body;

        let user = await User.findOne({ email });
        if (user) {
            res.status(400).json({ message: "Email already exists" });
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const verificationToken = generateVerificationCode();
        user = new User({
            name,
            email,
            password: hashedPassword,
            phone_number,
            verificationToken,
            verificationTokenExpires: new Date(Date.now() + 24 * 60 * 60 * 1000),
        });

        const token = await genrateToken(res, user);

        // await sendVerificationEmail(email, name, verificationToken);

        await user.save();

        const {
            password: _,
            verificationToken: __,
            verificationTokenExpires: ___,
            resetPasswordToken: ____,
            resetPasswordExpires: _____,
            ...userWithoutSensitiveData
        } = user.toObject();
        return res
            .status(201)
            .cookie("token", token, {
                httpOnly: true,
                sameSite: "strict",
                maxAge: 24 * 60 * 60 * 1000,
            })
            .json({
                output: 1,
                message: "User created successfully",
                jsonResponse: userWithoutSensitiveData,
                token: token,
            });
    } catch (error) {
        console.error("Signup Error: ", error);
        if (!res.headersSent) {
            res.status(500).json({ message: "Failed to create user" });
        }
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res
                .status(400)
                .json({
                    message: "Invalid email or password",
                    output: 0,
                    jsonResponse: null,
                });
        }
        user.lastLogin = new Date();
        await user.save();
        const UserWithoutPassword = await User.findOne(
            { email: email },
            { password: 0, verificationToken: 0, verificationTokenExpires: 0, resetPasswordToken: 0, resetPasswordExpires: 0, __v: 0 }
        );
        const token = await genrateToken(res, user);
        return res.status(200)
            .cookie("token", token, {
                httpOnly: true,
                sameSite: "strict",
                maxAge: 24 * 60 * 60 * 1000,
            })
            .json({
                output: 1,
                message: "User logged in successfully",
                jsonResponse: UserWithoutPassword,
                token: token,
            });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Failed to login user",
        });
    }
};


export const isUserRegistered = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (user) {
            return res.status(200).json({
                output: 1,
                message: "User already registered",
                jsonResponse: null,
            });
        }
        return res.status(200).json({
            output: 0,
            message: "User not registered",
            jsonResponse: null,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Failed to check user registration",
        });
    }
}


export const VerifyEmail = async (req: Request, res: Response) => {
    try {
        const { otp } = req.body; // Get email and OTP from request body
        const userID = req.userID;
        if (!userID || !otp) {
            return res.status(400).json({ message: "Email and OTP are required" });
        }

        // Find user with matching email and OTP that hasn't expired
        const user = await User.findOne({
            _id: userID,
            verificationToken: otp, // Match OTP
            verificationTokenExpires: { $gt: Date.now() }, // Check expiry
        });

        if (!user) {
            return res.status(400).json({ message: "Invalid or expired OTP" });
        }

        // Mark user as verified
        user.isVerified = true;
        user.verificationToken = ""; // Clear OTP
        user.verificationTokenExpires = null;
        await user.save();

        return res.status(200).json({
            output: 1,
            message: "Email verified successfully",
            jsonResponse: {
                _id: user._id,
                email: user.email,
                isVerified: user.isVerified,
            },
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Failed to verify email" });
    }
};


export const sendEmailVerificationToken = async (req: Request, res: Response) => {
    try {
        const userID = req.userID;
        const user = await User.findById(userID);
        if (!user) {
            return res.status(400).json({ message: "Email not found" });
        }

        const verificationToken = generateVerificationCode();
        user.verificationToken = verificationToken;
        user.verificationTokenExpires = new Date(Date.now() + 1 * 60 * 60 * 1000); // 1 hour
        await user.save();

        // send email verification email

        // await sendVerificationEmail(user.email, user.name, user.verificationToken)
        return res.status(200).json({
            output: 1,
            message: "Email verification link sent to your email",
            jsonResponse: null,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Failed to send email verification email" });
    }

}



export const logout = async (req: Request, res: Response) => {
    try {
        return res.clearCookie("token").status(200).json({
            output: 1,
            message: "Logged out successfully",
        });
    } catch (error) {
        return res.status(401).json({ message: "Unauthorized" });
    }
};

export const forgotPassword = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Email not found" });
        }
        const token = crypto.randomBytes(40).toString("hex");

        const resetTokenExpireAt = new Date(Date.now() + 1 * 60 * 60 * 1000);

        user.resetPasswordToken = token;
        user.resetPasswordExpires = resetTokenExpireAt;
        await user.save();

        // send password reset email

        // await sendPasswordResetEmail(user.email, `${process.env.FRONTEND_URL}resetpassword/${token}`);

        return res.status(200).json({
            output: 1,
            message: "Password reset link sent to your email",
            jsonResponse: null,
        });
    } catch (error) {
        console.log(error);
        return res
            .status(500)
            .json({ message: "Failed to send forgot password email" });
    }
};



export const resetPassword = async (req: Request, res: Response) => {
    try {
        const { token, password } = req.body;
        const user = await User.findOne({ resetPasswordToken: token });
        if (!user) {
            return res.status(400).json({ message: "Invalid token" });
        }
        if (user.resetPasswordExpires) {

            const resetTokenExpireAt = new Date(user.resetPasswordExpires);
            if (resetTokenExpireAt < new Date()) {
                return res.status(400).json({ message: "Token has expired" });
            }
            const hashedPassword = await bcrypt.hash(password, 10);
            user.password = hashedPassword;
            user.resetPasswordToken = null;
            user.resetPasswordExpires = null;
            await user.save();
            //send success reset email
            // await passwordResetConfirmationEmail(user.email);

            return res.status(200).json({
                output: 1,
                message: "Password reset successfully",
                jsonResponse: null,
            });

        } else {
            return res.status(400).json({ message: "Invalid token" });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Failed to reset password" });
    }
};

export const checkAuth = async (
    req: Request,
    res: Response
): Promise<Response> => {
    try {
        const userID = req.userID;
        const user = await User.findById({ _id: userID }, { password: 0, verificationToken: 0, verificationTokenExpires: 0, resetPasswordToken: 0, resetPasswordExpires: 0, __v: 0 });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.status(200).json({
            output: 1,
            user: user,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Failed to check authentication" });
    }
};

export const updateProfile = async (req: Request, res: Response): Promise<Response> => {
    try {
        const userID = req.userID; // Assuming userID is attached to the request by middleware
        const user = await User.findById(userID);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const updateData = req.body;

        for (const [key, value] of Object.entries(updateData)) {
            if (value !== undefined && value !== null) {
                (user as any)[key] = value; // Dynamically update only provided fields
            }
        }
        const imageUrl = (req?.file as any)?.path?.split("image/upload/")[1] || null;
        if (imageUrl) {
            user.profile_picture = imageUrl;
        }
        user.updated_at = new Date();
        await user.save();

        return res.status(200).json({
            output: 1,
            message: "Profile updated successfully",
            jsonResponse: null,
        });
    } catch (error) {
        console.error("Update Profile Error: ", error);
        return res.status(500).json({
            message: "Failed to update profile",
        });
    }
};

export const getUserProfile = async (req: Request, res: Response): Promise<Response> => {
    try {
        const userID = req.userID; // Assuming userID is attached to the request by middleware
        const user = await User.findById(userID, { password: 0, verificationToken: 0, verificationTokenExpires: 0, resetPasswordToken: 0, resetPasswordExpires: 0, __v: 0 });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({
            output: 1,
            jsonResponse: user,
            message: 'ok'
        });
    } catch (error) {
        console.error("Get User Profile Error: ", error);
        return res.status(500).json({
            message: "Failed to get user profile",
        });
    }
};


export const deleteUser = async (req: Request, res: Response) => {
    return res.status(200).json({ msg: "delete user" });
};
