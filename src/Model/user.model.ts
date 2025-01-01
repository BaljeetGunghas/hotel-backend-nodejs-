import mongoose, { Document } from 'mongoose';

export interface IUser {
    name: string;
    email: string;
    password: string;
    phone_number: string;
    role: string;
    profile_picture: string;
    country: string;
    state: string;
    city: string;
    status: string;
    date_of_birth: Date;
    isVerified?: boolean | null;
    lastLogin?: Date | null;
    resetPasswordToken?: string | null;
    resetPasswordExpires?: Date | null;
    verificationToken?: string | null;
    verificationTokenExpires?: Date | null;
}

export interface IUserDocument extends IUser, Document {
    created_at: Date;
    updated_at: Date;
}


const userSchema = new mongoose.Schema<IUserDocument>({
    name: { type: String, required: true }, //name
    email: { type: String, unique: true, required: true },  //email
    password: { type: String, required: true }, //password
    phone_number: { type: String, default: null }, //phone number
    role: { type: String, enum: ['customer', 'host', 'admin'], default: 'customer' },
    profile_picture: { type: String, default: null },
    country: { type: String, default: null },
    state: { type: String, default: null },
    city: { type: String, default: null },
    status: { type: String, enum: ['active', 'inactive', 'banned'], default: 'active' },    //active, inactive, banned
    date_of_birth: { type: Date, default: null },
    //advance 
    isVerified: { type: Boolean, default: false },  //email verification
    lastLogin: { type: Date, default: Date.now },      //last login
    resetPasswordToken: { type: String || null },   //reset password token
    resetPasswordExpires: { type: Date || null },   //reset password token expiry
    verificationToken: { type: String || null },    //email verification token
    verificationTokenExpires: { type: Date || null },   //email verification token expiry
}, { timestamps: true });

export const User = mongoose.model('User', userSchema);
