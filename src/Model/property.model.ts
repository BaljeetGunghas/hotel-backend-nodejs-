import mongoose, { Schema, Document } from "mongoose";

interface IProperty extends Document {
    name: string;
    location: string;
    // Add other necessary fields
}

const PropertySchema = new Schema<IProperty>({
    name: { type: String, required: true },
    location: { type: String, required: true },
    // Define additional fields here
});

export const Property = mongoose.model<IProperty>("Property", PropertySchema);
