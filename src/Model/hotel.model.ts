import mongoose, { Document } from 'mongoose';

export interface IHotel {
    hostid: mongoose.Schema.Types.ObjectId;
    name: string;
    owner_name: string;
    description: string;
    address: string;
    city: string;
    postal_code: string;
    rating: number;
    rooms: number;
    reviews: mongoose.Schema.Types.ObjectId[];
    policies?: Object;
    cancellation_policy?: Object;
    contact_number: number;
    email: string;
    status: string;
    hotel_image: string[] | null;
};

export interface IHotelDocument extends IHotel, Document {
    created_at: Date;
    updated_at: Date;
};


const hotelSchema = new mongoose.Schema<IHotelDocument>({
    hostid: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    owner_name: { type: String },
    description: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    postal_code: { type: String, required: true },
    rating: { type: Number, min: 0, max: 5, default: 0 },
    rooms: { type: Number, default: 0 },
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Hotel_Review' }],
    policies: { type: Object }, // JSON object for policies like check-in, check-out, etc.
    cancellation_policy: { type: Object }, // JSON object for cancellation rules    
    contact_number: { type: Number, required: true, minlength: 10, maxlength: 10, unique: true },
    email: { type: String },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    hotel_image: { type: [String], maxlength: 5, default: null },
}, { timestamps: true });

export const Hotel = mongoose.model('Hotel', hotelSchema);
