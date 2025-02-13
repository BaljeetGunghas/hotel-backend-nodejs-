import mongoose from "mongoose";

export const connectdb = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI!);
        console.log("Connected to the database");
    } catch (error) {
        console.log(error);

    }
}