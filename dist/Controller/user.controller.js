"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.getUserProfile = exports.updateProfile = exports.checkAuth = exports.resetPassword = exports.forgotPassword = exports.logout = exports.sendEmailVerificationToken = exports.VerifyEmail = exports.isUserRegistered = exports.login = exports.signup = void 0;
const user_model_1 = require("../Model/user.model");
const crypto = __importStar(require("crypto"));
const genrateToken_1 = require("../utils/genrateToken");
const genrateVerificationCode_1 = require("../utils/genrateVerificationCode");
const EmailTamplate_1 = require("../emailServices/EmailTamplate");
const emailService_1 = require("../emailServices/emailService");
const bcrypt = require("bcrypt");
const signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, password, phone_number } = req.body;
        let user = yield user_model_1.User.findOne({ email });
        if (user) {
            res.status(400).json({ message: "Email already exists" });
            return;
        }
        const hashedPassword = yield bcrypt.hash(password, 10);
        const verificationToken = (0, genrateVerificationCode_1.generateVerificationCode)();
        user = new user_model_1.User({
            name,
            email,
            password: hashedPassword,
            phone_number,
            verificationToken,
            verificationTokenExpires: new Date(Date.now() + 24 * 60 * 60 * 1000),
        });
        const token = yield (0, genrateToken_1.genrateToken)(res, user);
        // await sendVerificationEmail(email, name, verificationToken);
        const WelcomeEmailTamplateUpdated = yield (0, EmailTamplate_1.WelcomeEmailTamplate)(name);
        yield (0, emailService_1.sendEmail)(email, "Welcome to Velvet Haven", WelcomeEmailTamplateUpdated);
        yield user.save();
        const _a = user.toObject(), { password: _, verificationToken: __, verificationTokenExpires: ___, resetPasswordToken: ____, resetPasswordExpires: _____ } = _a, userWithoutSensitiveData = __rest(_a, ["password", "verificationToken", "verificationTokenExpires", "resetPasswordToken", "resetPasswordExpires"]);
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
    }
    catch (error) {
        console.error("Signup Error: ", error);
        if (!res.headersSent) {
            res.status(500).json({ message: "Failed to create user" });
        }
    }
});
exports.signup = signup;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const user = yield user_model_1.User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }
        const isMatch = yield bcrypt.compare(password, user.password);
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
        yield user.save();
        const UserWithoutPassword = yield user_model_1.User.findOne({ email: email }, { password: 0, verificationToken: 0, verificationTokenExpires: 0, resetPasswordToken: 0, resetPasswordExpires: 0, __v: 0 });
        const token = yield (0, genrateToken_1.genrateToken)(res, user);
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
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Failed to login user",
        });
    }
});
exports.login = login;
const isUserRegistered = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        const user = yield user_model_1.User.findOne({ email });
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
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Failed to check user registration",
        });
    }
});
exports.isUserRegistered = isUserRegistered;
const VerifyEmail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { otp } = req.body;
        const userID = req.userID;
        if (!userID || !otp) {
            return res.status(400).json({ message: "User ID and OTP are required" });
        }
        // Find the user by ID
        const user = yield user_model_1.User.findById(userID);
        if (!user) {
            return res.status(200).json({ output: 0, message: "User not found", jsonResponse: null });
        }
        // Check if OTP matches
        if (user.verificationToken !== otp.toString()) {
            return res.status(200).json({ output: 0, message: "Incorrect OTP", jsonResponse: null });
        }
        // Check if OTP is expired
        if (!user.verificationTokenExpires || new Date(user.verificationTokenExpires) < new Date()) {
            return res.status(200).json({ output: 0, message: "OTP has expired", jsonResponse: null });
        }
        // Mark user as verified
        user.isVerified = true;
        user.verificationToken = null; // Clear OTP
        user.verificationTokenExpires = null;
        yield user.save();
        return res.status(200).json({
            output: 1,
            message: "Email verified successfully",
            jsonResponse: {
                _id: user._id,
                email: user.email,
                isVerified: user.isVerified,
            },
        });
    }
    catch (error) {
        console.error("Email Verification Error:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.VerifyEmail = VerifyEmail;
const sendEmailVerificationToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userID = req.userID;
        const user = yield user_model_1.User.findById(userID);
        if (!user) {
            return res.status(400).json({
                output: 0,
                message: "Email not found",
                jsonResponse: null,
            });
        }
        const verificationToken = (0, genrateVerificationCode_1.generateVerificationCode)();
        user.verificationToken = verificationToken;
        user.verificationTokenExpires = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes
        yield user.save();
        // send email verification email
        const VerifyEmailTamplateUpdated = yield (0, EmailTamplate_1.VerifyEmailTamplate)(user.name, verificationToken);
        yield (0, emailService_1.sendEmail)(user.email, "Email Verification", VerifyEmailTamplateUpdated);
        // await sendVerificationEmail(user.email, user.name, user.verificationToken)
        return res.status(200).json({
            output: 1,
            message: "Email verification link sent to your email",
            jsonResponse: null,
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Failed to send email verification email" });
    }
});
exports.sendEmailVerificationToken = sendEmailVerificationToken;
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return res.clearCookie("token").status(200).json({
            output: 1,
            message: "Logged out successfully",
        });
    }
    catch (error) {
        return res.status(401).json({ message: "Unauthorized" });
    }
});
exports.logout = logout;
const forgotPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        const user = yield user_model_1.User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Email not found" });
        }
        const token = crypto.randomBytes(40).toString("hex");
        const resetTokenExpireAt = new Date(Date.now() + 1 * 60 * 60 * 1000);
        user.resetPasswordToken = token;
        user.resetPasswordExpires = resetTokenExpireAt;
        yield user.save();
        // send password reset email
        // await sendPasswordResetEmail(user.email, `${process.env.FRONTEND_URL}resetpassword/${token}`);
        return res.status(200).json({
            output: 1,
            message: "Password reset link sent to your email",
            jsonResponse: null,
        });
    }
    catch (error) {
        console.log(error);
        return res
            .status(500)
            .json({ message: "Failed to send forgot password email" });
    }
});
exports.forgotPassword = forgotPassword;
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { token, password } = req.body;
        const user = yield user_model_1.User.findOne({ resetPasswordToken: token });
        if (!user) {
            return res.status(400).json({ message: "Invalid token" });
        }
        if (user.resetPasswordExpires) {
            const resetTokenExpireAt = new Date(user.resetPasswordExpires);
            if (resetTokenExpireAt < new Date()) {
                return res.status(400).json({ message: "Token has expired" });
            }
            const hashedPassword = yield bcrypt.hash(password, 10);
            user.password = hashedPassword;
            user.resetPasswordToken = null;
            user.resetPasswordExpires = null;
            yield user.save();
            //send success reset email
            // await passwordResetConfirmationEmail(user.email);
            return res.status(200).json({
                output: 1,
                message: "Password reset successfully",
                jsonResponse: null,
            });
        }
        else {
            return res.status(400).json({ message: "Invalid token" });
        }
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Failed to reset password" });
    }
});
exports.resetPassword = resetPassword;
const checkAuth = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userID = req.userID;
        const user = yield user_model_1.User.findById({ _id: userID }, { password: 0, verificationToken: 0, verificationTokenExpires: 0, resetPasswordToken: 0, resetPasswordExpires: 0, __v: 0 });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.status(200).json({
            output: 1,
            user: user,
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Failed to check authentication" });
    }
});
exports.checkAuth = checkAuth;
const updateProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const userID = req.userID; // Assuming userID is attached to the request by middleware
        const user = yield user_model_1.User.findById(userID);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const updateData = req.body;
        for (const [key, value] of Object.entries(updateData)) {
            if (value !== undefined && value !== null) {
                user[key] = value; // Dynamically update only provided fields
            }
        }
        const imageUrl = ((_b = (_a = req === null || req === void 0 ? void 0 : req.file) === null || _a === void 0 ? void 0 : _a.path) === null || _b === void 0 ? void 0 : _b.split("image/upload/")[1]) || null;
        if (imageUrl) {
            user.profile_picture = imageUrl;
        }
        user.updated_at = new Date();
        yield user.save();
        return res.status(200).json({
            output: 1,
            message: "Profile updated successfully",
            jsonResponse: null,
        });
    }
    catch (error) {
        console.error("Update Profile Error: ", error);
        return res.status(500).json({
            message: "Failed to update profile",
        });
    }
});
exports.updateProfile = updateProfile;
const getUserProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userID = req.userID; // Assuming userID is attached to the request by middleware
        const user = yield user_model_1.User.findById(userID, { password: 0, verificationToken: 0, verificationTokenExpires: 0, resetPasswordToken: 0, resetPasswordExpires: 0, __v: 0 });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.status(200).json({
            output: 1,
            jsonResponse: user,
            message: 'ok'
        });
    }
    catch (error) {
        console.error("Get User Profile Error: ", error);
        return res.status(500).json({
            message: "Failed to get user profile",
        });
    }
});
exports.getUserProfile = getUserProfile;
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    return res.status(200).json({ msg: "delete user" });
});
exports.deleteUser = deleteUser;
