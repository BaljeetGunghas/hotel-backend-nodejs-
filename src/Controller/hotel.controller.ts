import { Request, Response } from "express";
import { Hotel } from "../Model/hotel.model";
import { Room } from "../Model/room.model";
import { Hotel_Review } from "../Model/hotel_review";
import { Room_Review } from "../Model/room_review.model";

export const getHotelsList = async (req: Request, res: Response) => {
    try {
        const hotels = await Hotel.find().populate('hotel_reviews');


        res.status(200).json({
            output: 1,
            message: "Hotels fetched successfully",
            jsonResponse: hotels.length > 0 ? hotels : null,
        });
    } catch (error) {
        res.status(500).json({
            output: 0,
            message: (error as Error).message,
        });
    }
};

export const getspacificHotelbyHotelId = async (req: Request, res: Response) => {
    try {
        const { hotelId } = req.body;

        if (!hotelId) {
            return res.status(200).json({
                output: 0,
                message: "Hotel ID is required",
                jsonResponse: null
            });
        }
        const hotel = await Hotel.findById(hotelId);
        if (!hotel) {
            return res.status(404).json({
                output: 0,
                message: "Hotel not found",
                jsonResponse: null
            });
        }
        return res.status(200).json({
            output: 1,
            message: "Hotel fetched successfully",
            jsonResponse: hotel,
        });
    } catch (error) {
        return res.status(500).json({
            output: 0,
            message: (error as Error).message,
        });
    }
}

export const getSpecificHotelDetailsByHotelId = async (req: Request, res: Response) => {
    try {
        const { hotelId } = req.body;

        if (!hotelId) {
            return res.status(200).json({
                output: 0,
                message: "Hotel ID is required",
                jsonResponse: null,
            });
        }

        // Fetch the hotel details
        const hotel = await Hotel.findById(hotelId).select({ __v: 0 });
        if (!hotel) {
            return res.status(404).json({
                output: 0,
                message: "Hotel not found",
                jsonResponse: null,
            });
        }

        // Fetch hotel reviews
        const hotelReviews = await Hotel_Review.find({ hotel_id: hotelId }, { __v: 0 });

        // Fetch rooms in the hotel
        const rooms = await Room.find({ hotel_id: hotelId }, { __v: 0 });

        // Fetch reviews for each room
        const roomsWithReviews = await Promise.all(
            rooms.map(async (room) => {
                const roomReviews = await Room_Review.find({ room_id: room._id }, { __v: 0 });
                return {
                    ...room.toObject(),
                    reviews: roomReviews.length > 0 ? roomReviews : null,
                };
            })
        );

        // Construct the response object
        return res.status(200).json({
            output: 1,
            message: "Hotel fetched successfully",
            jsonResponse: {
                ...hotel.toObject(),
                reviews: hotelReviews.length > 0 ? hotelReviews : null,
                rooms: roomsWithReviews.length > 0 ? roomsWithReviews : null,
            },
        });
    } catch (error) {
        return res.status(500).json({
            output: 0,
            message: (error as Error).message,
        });
    }
};

export const createHotel = async (req: Request, res: Response) => {
    try {
        const { name, owner_name, description, address, city, postal_code, policies, cancellation_policy, contact_number, email,status } = req.body;
        const hostid = req.userID;
        const hotelexist = await Hotel.findOne({ contact_number: contact_number });

        if (!hostid) {
            return res.status(200).json({
                output: 0,
                message: "Host ID is required",
                jsonResponse: null
            });
        }

        if (hotelexist) {
            return res.status(200).json({
                output: 0,
                message: "Hotel already exist with this contact number",
                jsonResponse: null
            });
        }

        // Create an object with only the defined values
        const hotelData = {
            hostid,
            name,
            owner_name,
            description,
            address,
            city,
            postal_code,
            policies,
            cancellation_policy,
            contact_number,
            email,
            status
        };

        const filteredHotelData = Object.fromEntries(
            Object.entries(hotelData).filter(
                ([_, value]) => value !== undefined && value !== null
            )
        );

        const hotel = new Hotel(filteredHotelData);
        await hotel.save();

        // Send success response
        res.status(201).json({
            output: 1,
            message: "Hotel created successfully",
            jsonResponse: hotel,
        });
    } catch (error) {
        res.status(500).json({
            output: 0,
            message: (error as Error).message,
            jsonResponse: null
        });
    }
};

export const updatespacificHotelbyHotelId = async (req: Request, res: Response) => {
    try {
        const { hotelId, name, owner_name, description, address, city, state, country, postal_code, policies, cancellation_policy, contact_number, email, status } = req.body;

        if (!hotelId) {
            return res.status(200).json({
                output: 0,
                message: "Hotel ID is required",
                jsonResponse: null
            });
        }

        const hotel = await Hotel.findById(hotelId);
        if (!hotel) {
            return res.status(404).json({
                output: 0,
                message: "Hotel not found",
                jsonResponse: null
            });
        }


        if (req.userID !== hotel.hostid.toString()) {
            return res.status(403).json({
                output: 0,
                message: "You are not authorized to update this hotel",
                jsonResponse: null
            });
        }


        const hotelData = {
            name,
            owner_name,
            description,
            address,
            city,
            state,
            country,
            postal_code,
            policies,
            cancellation_policy,
            contact_number,
            email,
            status,
        };

        const filteredHotelData = Object.fromEntries(
            Object.entries(hotelData).filter(
                ([_, value]) => value !== undefined && value !== null
            )
        );
        const currentImages = hotel.hotel_image || [];
        const newImages = (req?.files as Express.Multer.File[])?.map((file: any) => (file as any)?.path?.split("image/upload/")[1] || null) ?? [];
        const updatedImages = [...currentImages, ...newImages];
        if (updatedImages.length) {
            filteredHotelData.hotel_image = updatedImages;
        }
        const updatedHotel = await Hotel.findByIdAndUpdate(hotelId, filteredHotelData, { new: true });

        return res.status(200).json({
            output: 1,
            message: "Hotel updated successfully",
            jsonResponse: updatedHotel,
        });
    } catch (error) {
        console.error("Error updating hotel:", error); // Log the error for debugging
        return res.status(500).json({
            output: 0,
            message: "An error occurred while updating the hotel.",
            error: (error as Error).message, // Optionally include the error message
        });
    }
}

export const gethostHotelList = async (req: Request, res: Response) => {
    try {

        const hostId = req.userID;
        const hotels = await Hotel.find({ hostid: hostId });
        res.status(200).json({
            output: hotels.length,
            message: "Hotels fetched successfully",
            jsonResponse: hotels.length > 0 ? hotels : null,
        });
    } catch (error) {
        res.status(500).json({
            output: 0,
            message: (error as Error).message,
        });
    }
};


export const deletespacificHotelbyHotelId = async (req: Request, res: Response) => {
    try {
        const { hotelId } = req.body;
        const userid = req.userID;

        if (!hotelId) {
            return res.status(200).json({
                output: 0,
                message: "Hotel ID is required",
                jsonResponse: null
            });
        }
        if (!userid) {
            return res.status(200).json({
                output: 0,
                message: "User ID is required",
                jsonResponse: null
            });
        }
        const hotel = await Hotel.findById(hotelId);
        if (!hotel) {
            return res.status(404).json({
                output: 0,
                message: "Hotel not found",
                jsonResponse: null
            });
        }
        if (String(hotel.hostid) !== userid) {
            return res.status(403).json({
                output: 0,
                message: "You are not authorized to delete this hotel",
                jsonResponse: null
            });
        }
        await Hotel.findById(hotelId).deleteOne();

        return res.status(200).json({
            output: 1,
            message: "Hotel deleted successfully",
            jsonResponse: null
        });
    } catch (error) {
        console.error("Error deleting hotel:", error); // Log the error for debugging
        return res.status(500).json({
            output: 0,
            message: "An error occurred while deleting the hotel.",
            error: (error as Error).message, // Optionally include the error message
        });
    }
}

export const addhotelReview = async (req: Request, res: Response) => {
    try {
        const { hotelId, userId, rating, comment } = req.body;
        if (!hotelId || !userId || !rating || !comment) {
            return res.status(200).json({
                output: 0,
                message: "Hotel ID, User ID, Rating, and Comment are required",
                jsonResponse: null
            });
        }
        const hotel = await Hotel.findById(hotelId);
        if (!hotel) {
            return res.status(404).json({
                output: 0,
                message: "Hotel not found",
                jsonResponse: null
            });
        };
        const review = await Hotel_Review.create({ hotel_id: hotelId, user_id: userId, rating, comment });
        hotel.reviews.push(review._id as any);
        const totalRating = ((+hotel.rating || 0) * (hotel.reviews.length - 1) + Number(rating)) / hotel.reviews.length;
        hotel.rating = +totalRating.toFixed(1);
        await hotel.save();

        return res.status(201).json({
            output: 1,
            message: "Review added successfully",
            jsonResponse: review,
        });
    } catch (error) {
        console.error("Error adding hotel review:", error); // Log the error for debugging
        return res.status(500).json({
            output: 0,
            message: "An error occurred while adding the review.",
            error: (error as Error).message, // Optionally include the error message
        });
    }
}


