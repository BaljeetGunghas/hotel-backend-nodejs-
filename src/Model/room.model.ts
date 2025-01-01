import mongoose, { Document } from 'mongoose';

export interface IRoom {
    hostid: mongoose.Schema.Types.ObjectId;
    hotel_id: mongoose.Schema.Types.ObjectId;
    room_number: number;
    room_type: string;
    price_per_night: number;
    max_occupancy: number;
    features: Object;
    floor_number: number;
    bed_type: string;
    availability_status: boolean;
    view_type: string;
    smoking_allowed: boolean;
    description: string;
    rating: number | null;
    reviews: mongoose.Schema.Types.ObjectId[];
    check_in_time: string;
    check_out_time: string;
};

export interface IRoomDocument extends IRoom, Document {
    created_at: Date;
    updated_at: Date;
};

const roomSchema = new mongoose.Schema<IRoomDocument>({
    hostid: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    hotel_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Hotel', required: true },
    room_number: { type: Number, required: true },
    room_type: { type: String, enum: ['Single', 'Double', 'Suite', 'Family', 'Deluxe'], default: 'Single' },
    price_per_night: { type: Number, required: true },  //price per night
    max_occupancy: { type: Number },    //maximum occupancy
    features: { type: Object }, // JSON object for features
    floor_number: { type: Number },
    bed_type: { type: String, enum: ['Single', 'Double', 'Queen', 'King'] },
    availability_status: { type: Boolean, default: true },
    view_type: { type: String },    //city, sea, mountain, garden, pool
    smoking_allowed: { type: Boolean, default: false },     //smoking allowed or not
    description: { type: String },
    rating: { type: Number, min: 0, max: 5, default: 0 },
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Room_Review' }],
    check_in_time: { type: String, default: "14:00" },
    check_out_time: { type: String, default: "12:00" }
}, { timestamps: true });


export const Room = mongoose.model('Room', roomSchema);
