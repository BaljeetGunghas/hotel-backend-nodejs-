import mongoose, { Schema, Document } from "mongoose";

interface IShortlistedRoom extends Document {
    user_id: mongoose.Types.ObjectId;
    hotel_id: mongoose.Types.ObjectId;
    room_id: mongoose.Types.ObjectId;
    created_at: Date;
}

const ShortlistedRoomSchema = new Schema<IShortlistedRoom>({
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    hotel_id: { type: Schema.Types.ObjectId, ref: "Hotel", required: true },
    room_id: { type: Schema.Types.ObjectId, ref: "Room", required: true },
    created_at: { type: Date, default: Date.now }
});

export const ShortlistedRoom = mongoose.model<IShortlistedRoom>("ShortlistedRoom", ShortlistedRoomSchema);
