import mongoose, { Document } from 'mongoose';

export interface IReview {
    user_id: mongoose.Schema.Types.ObjectId;
    hotel_id: mongoose.Schema.Types.ObjectId;
    room_id: mongoose.Schema.Types.ObjectId;
    rating: number;
    comment: string;
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    dislikes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    // images: string[];
};

export interface IReviewDocument extends IReview, Document {
    created_at: Date;
};

const reviewSchema = new mongoose.Schema<IReviewDocument>({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    hotel_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Hotel' },
    room_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Room' },
    rating: { type: Number, min: 1, max: 5, required: true },
    comment: { type: String },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', default: [] }],
    dislikes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', default: [] }],
    // images: [{ type: String }], // Array of image URLs
    created_at: { type: Date, default: Date.now },
});

export const Room_Review = mongoose.model('Room_Review', reviewSchema);
