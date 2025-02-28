import { Request, Response } from "express";
import cloudinary from "../Helper/cloudinaryConfig";
import { Hotel } from "../Model/hotel.model";



const getPublicId = (url: string) => {
    return url
        .replace(/^v\d+\//, "") // Remove version prefix
        .replace(/\.[^.]+$/, ""); // Remove file extension
};

export const deleteImage = async (req: Request, res: Response) => {
    try {
        let { public_id, hotelId, type } = req.body;
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
        if (type === 'hotel') {
            const hotel = await Hotel.findById(hotelId);
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
                })
            }
            const updpublic_id = getPublicId(public_id);
            const respons = await cloudinary.uploader.destroy(updpublic_id);

            const hotelImage = hotel.hotel_image;

            const filteredImage = hotelImage?.filter((image) => image !== public_id);

            hotel.hotel_image = filteredImage ?? null;

            hotel.save();

            return res.status(200).json({
                output: 1,
                message: "Image deleted successfully",
                jsonResponse: respons

            })


        }



    } catch (error) {
        if (error instanceof Error) {
            console.log(error.message)
            res.status(500).json({
                output: 0,
                jsonResponse: null,
                message: error.message
            })
        } else {
            console.log(String(error))
            res.status(500).json({
                output: 0,
                jsonResponse: null,
                message: String(error)
            })
        }
    }
}