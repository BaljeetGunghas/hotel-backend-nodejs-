import mongoose, { Schema, Document } from "mongoose";

interface IShortlistedHotel extends Document {
    user_id: mongoose.Types.ObjectId;
    hotel_id: mongoose.Types.ObjectId;
    created_at: Date;
}

const ShortlistedHotelSchema = new Schema<IShortlistedHotel>({
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    hotel_id: { type: Schema.Types.ObjectId, ref: "Hotel", required: true },
    created_at: { type: Date, default: Date.now }
});

export const ShortlistedHotel = mongoose.model<IShortlistedHotel>("ShortlistedHotel", ShortlistedHotelSchema);
