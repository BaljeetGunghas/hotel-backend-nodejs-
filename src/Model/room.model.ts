import mongoose, { Document } from 'mongoose';

export interface IRoom {
    hostid: mongoose.Schema.Types.ObjectId;
    hotel_id: mongoose.Schema.Types.ObjectId;
    room_number: number;
    room_type: string;
    price_per_night: number;
    max_occupancy: number;  
    floor_number: number;
    bed_type: string;
    availability_status: string;
    amenities: string[] | null;
    description: string;
    rating: number | null;
    reviews: mongoose.Schema.Types.ObjectId[];
    check_in_time: string;
    check_out_time: string;
    room_images: string[] | null;
};

export interface IRoomDocument extends IRoom, Document {
    created_at: Date;
    updated_at: Date;
};

const roomSchema = new mongoose.Schema<IRoomDocument>({
    hostid: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    hotel_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Hotel', required: true },
    room_number: { type: Number, required: true },
    room_type: { type: String, enum: ['single', 'double', 'suite', 'family', 'deluxe'], default: 'single' },
    price_per_night: { type: Number, required: true },  //price per night
    max_occupancy: { type: Number, default: 3 },    //maximum occupancy
    floor_number: { type: Number, required: true },
    bed_type: { type: String, enum: ['single', 'double', 'queen', 'king'] },
    availability_status: { type: String, enum: ['available', 'occupied', 'under_maintenance'], default: 'available' },
    description: { type: String },
    amenities: { type: [String], default: null },
    rating: { type: Number, min: 0, max: 5, default: 0 },
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Room_Review' }],
    check_in_time: { type: String, default: "10:00" },
    check_out_time: { type: String, default: "12:00" },
    room_images: { type: [String], maxlength: 5, default: null },
}, { timestamps: true });


export const Room = mongoose.model('Room', roomSchema);

