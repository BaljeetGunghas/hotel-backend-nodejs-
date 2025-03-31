import mongoose, { Document } from 'mongoose';

export interface IContact {
    name: string;
    email: string;
    message: string;
    subject: string;
};

export interface IContactDocument extends IContact, Document {
    created_at: Date;
};

const contactusSchema = new mongoose.Schema<IContactDocument>({
    name: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true },
    subject: { type: String, required: true },
    created_at: { type: Date, default: Date.now },
});

export const Contact_Enquery = mongoose.model('Contact_Enquery', contactusSchema);
