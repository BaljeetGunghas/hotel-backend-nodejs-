import { Request, Response } from "express";
import cloudinary from "../Helper/cloudinaryConfig";
import { Hotel } from "../Model/hotel.model";
import { Room } from "../Model/room.model";


const getPublicId = (url: string) => {
    return decodeURIComponent(url.replace(/^v\d+\//, "").replace(/\.[^.]+$/, "")); 
};


export const deleteImage = async (req: Request, res: Response) => {
    try {
        let { public_id, _id, type, roomId } = req.body;
        const userId = req.userID;

        if (!public_id) {
            return res.status(200).json({
                output: 0,
                message: "Image ID is required",
                jsonResponse: null
            });
        }
        if (!userId) {
            return res.status(200).json({
                output: 0,
                message: "User ID is required",
                jsonResponse: null
            })
        }

        const updpublic_id = getPublicId(public_id);
        console.log("Extracted public_id:", updpublic_id);

        if (type === 'hotel') {
            const hotel = await Hotel.findById(_id);
            if (!hotel) {
                return res.status(200).json({
                    output: 0,
                    message: "Hotel not found",
                    jsonResponse: null
                });
            }
            if (String(hotel.hostid) !== userId) {
                return res.status(200).json({
                    output: -401,
                    message: "You are not authorized to delete this image",
                    jsonResponse: null
                });
            }

            const response = await cloudinary.uploader.destroy(updpublic_id);

            if (response.result !== "not found") {
                hotel.hotel_image = hotel.hotel_image?.filter((image) => image !== public_id) ?? null;
                await hotel.save();

                return res.status(200).json({
                    output: 1,
                    message: "Hotel image deleted successfully",
                    jsonResponse: response
                });
            }
        } else if (type === 'room') {
            const room = await Room.findById(_id);
            if (!room) {
                return res.status(200).json({
                    output: 0,
                    message: "Room not found",
                    jsonResponse: null
                });
            }
            if (String(room.hostid) !== userId) {
                return res.status(200).json({
                    output: -401,
                    message: "You are not authorized to delete this image",
                    jsonResponse: null
                });
            }

            const response = await cloudinary.uploader.destroy(updpublic_id);

            if (response.result !== "not found") {
                room.room_images = room.room_images?.filter((image) => image !== public_id) ?? null;
                await room.save();

                return res.status(200).json({
                    output: 1,
                    message: "Room image deleted successfully",
                    jsonResponse: response
                });
            }
        }

        return res.status(200).json({
            output: 0,
            message: "Something went wrong!",
            jsonResponse: null
        });

    } catch (error) {
        console.error("Error deleting image:", error);
        return res.status(500).json({
            output: 0,
            jsonResponse: null,
            message: error instanceof Error ? error.message : String(error)
        });
    }
};
