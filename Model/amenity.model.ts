import mongoose, { Document } from 'mongoose';

export interface IAmenity {
    name: string;
    category: string;
    description?: string;
    is_paid: boolean;
}

export interface IAmenityDocument extends IAmenity, Document {
    created_at: Date;
}

const amenitySchema = new mongoose.Schema<IAmenityDocument>({
    name: { type: String, required: true },
    category: { type: String, enum: ['Hotel', 'Room'], required: true },
    description: { type: String },
    is_paid: { type: Boolean, default: false },
    created_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Amenity', amenitySchema);
