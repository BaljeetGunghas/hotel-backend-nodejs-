import mongoose, { Document } from 'mongoose';

export interface IReview {
    user_id: mongoose.Schema.Types.ObjectId;
    hotel_id: mongoose.Schema.Types.ObjectId;
    rating: number;
    comment: string;
};

export interface IReviewDocument extends IReview, Document {
    created_at: Date;
};

const reviewSchema = new mongoose.Schema<IReviewDocument>({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    hotel_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Hotel' },
    rating: { type: Number, min: 1, max: 5, required: true },
    comment: { type: String },
    // images: [{ type: String }], // Array of image URLs
    created_at: { type: Date, default: Date.now },
});

export const Hotel_Review = mongoose.model('Hotel_Review', reviewSchema);
