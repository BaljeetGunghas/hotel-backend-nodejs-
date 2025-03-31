import { Request, Response } from "express";
import { Room } from "../Model/room.model";
import { Hotel } from "../Model/hotel.model";
import { IReviewDocument, Room_Review } from "../Model/room_review.model";
import mongoose, { Document } from "mongoose";
import { Booking } from "../Model/booking.model";
import { getHotelByCity } from "../Helper/getHotelByCity";
import { ShortlistedRoom } from "../Model/shortlistedRoom.model";
import { isAutheticatedByPass } from "../middlewares/isAuthenticatedByPass";
const jwt = require('jsonwebtoken');

export const getAllRooms = async (req: Request, res: Response) => {
    try {
        const rooms = await Room.find();

        return res.status(200).json({
            output: 1,
            message: "Rooms fetched successfully",
            jsonResponse: rooms.length > 0 ? rooms : null,
        });
    } catch (error) {
        return res.status(500).json({
            output: 0,
            message: (error as Error).message,
            jsonResponse: null,
        });
    }
};

export const searchRooms = async (req: Request, res: Response) => {
    try {
        let { city, check_in_date, check_out_date, adults, children, minPrice, maxPrice, amenities, rating, page } = req.query;

        if (!city || !check_in_date || !check_out_date) {
            return res.status(400).json({ message: "City, check-in, and check-out dates are required" });
        }
        let user_id = await isAutheticatedByPass(req);

        const checkInDate = new Date(check_in_date as string);
        const checkOutDate = new Date(check_out_date as string);
        if (isNaN(checkInDate.getTime()) || isNaN(checkOutDate.getTime()) || checkInDate >= checkOutDate) {
            return res.status(400).json({ message: "Invalid check-in or check-out date" });
        }

        const parsedPage = parseInt(page as string) || 1;
        const parsedLimit = 3;

        // Get booked room IDs in the given date range
        const bookedRooms = await Booking.find({
            check_in_date: { $lt: checkOutDate },
            check_out_date: { $gt: checkInDate },
            booking_status: { $in: ["pending", "confirmed"] }
        }).distinct("room_id");

        // Get properties in the specified city
        const propertyIDs = await getHotelByCity(city as string);
        if (!propertyIDs.length) {
            return res.status(200).json({
                output: 0,
                message: "No properties found in the specified city",
                jsonResponse: null,
            });
        }

        // Construct query for available rooms
        let query: any = {
            hotel_id: { $in: propertyIDs },
            _id: { $nin: bookedRooms },
        };

        // Additional filters
        const totalGuests = (parseInt(adults as string) || 0) + (parseInt(children as string) || 0);
        if (totalGuests > 0) query.max_occupancy = { $gte: totalGuests };
        if (Number(minPrice) > 0 && Number(maxPrice) > 0) {
            query.price_per_night = {
                $gte: Number(minPrice),
                $lte: Number(maxPrice)
            };
        }
        if (amenities) query.amenities = { $all: (amenities as string[]) };
        if (rating) query.rating = { $gte: parseFloat(rating as string) };

        // Fetch available rooms with pagination
        const availableRooms = await Room.find(query)
            .select("room_images _id hotel_id amenities room_type price_per_night max_occupancy bed_type rating check_in_time check_out_time")
            .skip((parsedPage - 1) * parsedLimit)
            .limit(parsedLimit);

        let shortlistedRoomIds: string[] = [];
        if (user_id) {
            const shortlistedRooms = await ShortlistedRoom.find({ user_id }).select("room_id");
            shortlistedRoomIds = shortlistedRooms.map(room => room.room_id.toString());
        }


        const formattedRooms = availableRooms.map(room => ({
            amenities: room.amenities,
            image: room.room_images?.length ? room.room_images[0] : null,
            _id: room._id,
            hotel_id: room.hotel_id,
            room_type: room.room_type,
            price_per_night: room.price_per_night,
            max_occupancy: room.max_occupancy,
            bed_type: room.bed_type,
            rating: room.rating,
            is_shortlisted: user_id ? shortlistedRoomIds.includes((room._id as mongoose.Types.ObjectId).toString()) : false,
            check_in_time: room.check_in_time,
            check_out_time: room.check_out_time
        }));

        const totalRooms = await Room.countDocuments(query);

        res.status(200).json({
            output: availableRooms?.length,
            message: 'ok',
            jsonResponse: {
                rooms: formattedRooms,
                totalPages: Math.ceil(totalRooms / parsedLimit),
                currentPage: parsedPage
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const getSingleSearchRoom = async (req: Request, res: Response) => {
    try {
        const { roomId } = req.body;
        const userId = req.userID;

        if (!roomId) {
            return res.status(400).json({
                output: 0,
                message: "Room ID is required",
                jsonResponse: null,
            });
        }
        const room = await Room.findById(roomId).select("room_images _id hotel_id amenities room_type price_per_night max_occupancy bed_type rating check_in_time check_out_time");
        if (!room) {
            return res.status(404).json({
                output: 0,
                message: "Room not found",
                jsonResponse: null,
            });
        }
        const isShortlistRoom = await ShortlistedRoom.findOne({ user_id: userId, room_id: roomId }).select("room_id");

        const formattedRoom = {
            amenities: room.amenities,
            image: room.room_images?.length ? room.room_images[0] : null,
            _id: room._id,
            hotel_id: room.hotel_id,
            room_type: room.room_type,
            price_per_night: room.price_per_night,
            max_occupancy: room.max_occupancy,
            bed_type: room.bed_type,
            rating: room.rating,
            is_shortlisted: isShortlistRoom ? true : false,
            check_in_time: room.check_in_time,
            check_out_time: room.check_out_time
        };
        return res.status(200).json({
            output: 1,
            message: "Room fetched successfully",
            jsonResponse: formattedRoom,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            output: 0,
            message: (error as Error).message,
            jsonResponse: null,
        });
    }
};

export const gethostAllRoom = async (req: Request, res: Response) => {
    try {
        const hostid = req.userID;

        if (!hostid) {
            return res.status(200).json({
                output: 0,
                message: "Host_id is missing",
                jsonResponse: null,
            });
        }
        const rooms = await Room.find({ hostid })
            .populate('hotel_id', " _id name");

        return res.status(200).json({
            output: rooms.length,
            message: "Rooms fetched successfully",
            jsonResponse: rooms.length > 0 ? rooms : null,
        })


    } catch (error) {
        return res.status(500).json({
            output: 0,
            message: (error as Error).message,
            jsonResponse: null,
        });
    }
}

export const getSpacificCompleteRoombyRoomId = async (req: Request, res: Response) => {
    try {
        const { roomId } = req.body;
        let userId = await isAutheticatedByPass(req);
        if (userId) {
            userId = new mongoose.Types.ObjectId(userId);
        }

        if (!roomId) {
            return res.status(400).json({
                output: 0,
                message: "Room ID is required",
                jsonResponse: null,
            });
        }

        const room = await Room.findById({ _id: roomId }, { __v: 0, });
        if (!room) {
            return res.status(404).json({
                output: 0,
                message: "Room not found",
                jsonResponse: null,
            });
        }
        const hotel = await Hotel.findById({ _id: room.hotel_id }, { __v: 0, });

        const roomReviews = await Room_Review.find({ room_id: roomId }, { __v: 0 })
            .sort({ created_at: -1 }) // Get latest reviews
            .limit(3)
            .populate('user_id', 'name profile_picture'); // Include user id, name, and image

        const formattedReviews = roomReviews.map(review => ({
            ...review.toObject(),
            isLiked: userId ? review.likes.includes(userId) : false,
            isDisliked: userId ? review.dislikes.includes(userId) : false,
        }));
        const shortlistedRooms = await ShortlistedRoom.findOne({ user_id: userId, room_id: roomId }).select("room_id");

        return res.status(200).json({
            output: 1,
            message: "Room fetched successfully",
            jsonResponse: {
                roomDetails: { ...room.toObject(), hotel_name: hotel?.name, is_shortlisted: shortlistedRooms ? true : false },
                roomReviews: roomReviews.length > 0 ? formattedReviews : null,
                hotelDetails: hotel ? {
                    hotelId: hotel._id,
                    hotel_name: hotel.name,
                    hotelAddress: hotel.address,
                    hotelRating: hotel.rating,
                    hotelImage: hotel.hotel_image?.length ? hotel.hotel_image[0] : null,
                } : null,
            },
        });
    } catch (error) {
        return res.status(500).json({
            output: 0,
            message: (error as Error).message,
            jsonResponse: null,
        });
    }
};
export const getSpacificRoombyRoomId = async (req: Request, res: Response) => {
    try {
        const { roomId } = req.body;

        if (!roomId) {
            return res.status(400).json({
                output: 0,
                message: "Room ID is required",
                jsonResponse: null,
            });
        }

        const room = await Room.findById({ _id: roomId }, { __v: 0, reviews: 0 }).populate('hotel_id', " _id name");
        if (!room) {
            return res.status(404).json({
                output: 0,
                message: "Room not found",
                jsonResponse: null,
            });
        }
        return res.status(200).json({
            output: 1,
            message: "Room fetched successfully",
            jsonResponse: room,
        });
    } catch (error) {
        return res.status(500).json({
            output: 0,
            message: (error as Error).message,
            jsonResponse: null,
        });
    }
};

export const createRoom = async (req: Request, res: Response) => {
    try {
        const {
            hotel_id,
            room_number,
            room_type,
            price_per_night,
            max_occupancy,
            floor_number,
            bed_type,
            availability_status,
            amenities,
            description,
            rating,
            check_in_time,
            check_out_time,
        } = req.body;

        const hostid = req.userID;

        if (!hostid || !hotel_id) {
            return res.status(400).json({
                output: 0,
                message: "Please provide hostid and hotel_id",
                jsonResponse: null,
            });
        }
        if (!room_number) {
            return res.status(400).json({
                output: 0,
                message: "Please provide room_number",
                jsonResponse: null,
            });
        }
        const isRoomAlreadyCrated = await Room.findOne({
            room_number: room_number,
            hotel_id: hotel_id,
        });

        if (isRoomAlreadyCrated) {
            return res.status(200).json({
                output: 0,
                message: "Room already created within this hotel with this room number",
                jsonResponse: null,
            });
        }

        const room = new Room({
            hostid: hostid,
            hotel_id,
            room_number,
            room_type,
            amenities,
            price_per_night,
            max_occupancy,
            floor_number,
            bed_type,
            availability_status,
            description,
            rating,
            check_in_time,
            check_out_time,
        });
        await room.save();

        const hotel = await Hotel.findById(hotel_id);

        if (hotel) {
            hotel.rooms += 1;
            await hotel.save();
        }

        return res.status(201).json({
            output: 1,
            message: "Room created successfully",
            json: room,
        });
    } catch (error) {
        return res.status(500).json({
            output: 0,
            message: (error as Error).message,
            jsonResponse: null,
        });
    }
};

export const updateRoom = async (req: Request, res: Response) => {
    try {
        const {
            room_id,
            hotel_id,
            room_number,
            room_type,
            price_per_night,
            max_occupancy,
            floor_number,
            bed_type,
            amenities,
            availability_status,
            description,
            check_in_time,
            check_out_time,
        } = req.body;
        if (!room_id) {
            return res.status(400).json({
                output: 0,
                message: "Room ID is required",
                jsonResponse: null,
            });
        }

        const room = await Room.findById({ _id: room_id });
        if (!room) {
            return res.status(404).json({
                output: 0,
                message: "Room not found",
                jsonResponse: null,
            });
        }

        if (req.userID !== room.hostid.toString()) {
            return res.status(403).json({
                output: 0,
                message: "You are not authorized to update this room!",
                jsonResponse: null
            });
        }

        const parsedViewType = typeof amenities === "string" ? JSON.parse(amenities) : amenities;

        const updatedRoom = {
            hotel_id : hotel_id || room.hotel_id,
            room_number: room_number || room.room_number,
            room_type: room_type || room.room_type,
            price_per_night: price_per_night || room.price_per_night,
            max_occupancy: max_occupancy || room.max_occupancy,
            floor_number: floor_number || room.floor_number,
            bed_type: bed_type || room.bed_type,
            availability_status: availability_status || room.availability_status,
            description: description || room.description,
            check_in_time: check_in_time || room.check_in_time,
            check_out_time: check_out_time || room.check_out_time,
            room_images: room.room_images,
            amenities: Array.isArray(parsedViewType) ? parsedViewType : room.amenities,
        };

        const currentImages = room.room_images || [];
        const newImages = (req?.files as Express.Multer.File[])?.map((file: any) => (file as any)?.path?.split("image/upload/")[1] || null) ?? [];
        const updatedImages = [...currentImages, ...newImages];
        if (updatedImages.length) {
            updatedRoom.room_images = updatedImages;
        }



        const updatedRoomDoc = await Room.findByIdAndUpdate(room_id, updatedRoom, {
            new: true,
        });

        return res.status(200).json({
            output: 1,
            message: "Room updated successfully",
            jsonResponse: updatedRoomDoc,
        });
    } catch (error) {
        return res.status(500).json({
            output: 0,
            message: (error as Error).message,
            jsonResponse: null,
        });
    }
};

export const getRoomsByHotel = async (req: Request, res: Response) => {
    try {
        const { hotel_id } = req.body;
        if (!hotel_id) {
            return res.status(400).json({
                output: 0,
                message: "Hotel ID is required",
                jsonResponse: null,
            });
        }
        const rooms = await Room.find({ hotel_id: hotel_id }, { __v: 0 });

        return res.status(200).json({
            output: rooms.length > 0 ? rooms.length : 0,
            message: "Rooms fetched successfully",
            jsonResponse: rooms.length > 0 ? rooms : null,
        });
    } catch (error) {
        return res.status(500).json({
            output: 0,
            message: (error as Error).message,
            jsonResponse: null,
        });
    }
};

export const deleteRoom = async (req: Request, res: Response) => {
    try {
        const { roomId } = req.body;
        if (!roomId) {
            return res.status(400).json({
                output: 0,
                message: "Room ID is required",
                jsonResponse: null,
            });
        }
        const room = await Room.findById({ _id: roomId });
        if (!room) {
            return res.status(404).json({
                output: 0,
                message: "Room not found",
                jsonResponse: null,
            });
        }
        await Room.findByIdAndDelete(roomId);
        return res.status(200).json({
            output: 1,
            message: "Room deleted successfully",
            jsonResponse: null,
        });
    } catch (error) {
        return res.status(500).json({
            output: 0,
            message: (error as Error).message,
            jsonResponse: null,
        });
    }
};

export const shortListRoom = async (req: Request, res: Response) => {
    try {
        const { room_id, hotel_id } = req.body;
        const userID = req.userID;

        if (!room_id || !hotel_id) {
            return res.status(400).json({
                output: 0,
                message: "Room ID and Hotel ID are required",
                jsonResponse: null,
            });
        }

        // Check if room exists
        const room = await Room.findById(room_id);
        if (!room) {
            return res.status(200).json({
                output: 0,
                message: "Room not found",
                jsonResponse: null,
            });
        }

        // Check if hotel exists
        const hotel = await Hotel.findById(hotel_id);
        if (!hotel) {
            return res.status(200).json({
                output: 0,
                message: "Hotel not found",
                jsonResponse: null,
            });
        }

        // Check if the room is already shortlisted
        const existingShortlist = await ShortlistedRoom.findOne({
            user_id: userID,
            room_id,
            hotel_id
        });

        if (existingShortlist) {
            // If already shortlisted, remove it (toggle off)
            await ShortlistedRoom.deleteOne({ _id: existingShortlist._id });

            return res.status(200).json({
                output: 1,
                message: "Room unshortlisted successfully",
                jsonResponse: null,
            });
        }

        // If not shortlisted, add it (toggle on)
        const newShortlist = new ShortlistedRoom({
            user_id: userID,
            room_id,
            hotel_id,
        });

        await newShortlist.save();

        return res.status(201).json({
            output: 1,
            message: "Room shortlisted successfully",
            jsonResponse: newShortlist,
        });

    } catch (error) {
        return res.status(500).json({
            output: 0,
            message: (error as Error).message,
            jsonResponse: null,
        });
    }
};


// Add Revew to Room by Room ID
export const addRoomReview = async (req: Request, res: Response) => {
    try {
        const { roomId, hotelId, rating, comment } = req.body;
        const userId = req.userID;
        if (!roomId || !userId || !hotelId || !rating || !comment) {
            return res.status(400).json({
                output: 0,
                message: "Please provide all required fields",
                jsonResponse: null,
            });
        }
        const review: Document = new Room_Review({
            user_id: userId,
            hotel_id: hotelId,
            room_id: roomId,
            rating,
            comment,
        });
        await review.save();

        // update review count and rating in Room model
        const room = await Room.findById({ _id: roomId });
        if (room) {
            room.reviews.push(review._id as any);

            const totalRating = ((room.rating ? +room.rating : 0) * (room.reviews.length - 1) + Number(rating)) / room.reviews.length;

            room.rating = +totalRating.toFixed(1);
            await room.save();
        } else {
            return res.status(404).json({
                output: 0,
                message: "Room not found",
                jsonResponse: null,
            });
        }
        const newReview = await Room_Review.findById({ _id: review._id }, { __v: 0, })
            .populate("user_id", "name profile_picture")
            .lean();

        return res.status(200).json({
            output: 1,
            message: "Review added successfully",
            jsonResponse: {
                ...newReview,
                isLiked: false,
                isDisliked: false,
            },
        });
    } catch (error) {
        return res.status(500).json({
            output: 0,
            message: (error as Error).message,
            jsonResponse: null,
        });
    }
};


export const likeDislikeReview = async (req: Request, res: Response) => {
    try {
        const { reviewId, action } = req.body; // action: "like" or "dislike"
        const userId = new mongoose.Types.ObjectId(req.userID); // Ensure ObjectId

        const review = await Room_Review.findById(reviewId);
        if (!review) {
            return res.status(404).json({
                output: 0,
                message: "Review not found",
                jsonResponse: null,
            });
        }

        const hasLiked = review.likes.some(id => (id as unknown as mongoose.Types.ObjectId).equals(userId));
        const hasDisliked = review.dislikes.some(id => (id as unknown as mongoose.Types.ObjectId).equals(userId));

        let updateQuery: any = {};

        if (action === "like") {
            if (hasLiked) {
                updateQuery = { $pull: { likes: userId, } }; // Remove like
            } else {
                updateQuery = {
                    $addToSet: { likes: userId }, // Add like
                    $pull: { dislikes: userId }, // Remove dislike if exists
                };
            }
        } else if (action === "dislike") {
            if (hasDisliked) {
                updateQuery = { $pull: { dislikes: userId } }; // Remove dislike
            } else {
                updateQuery = {
                    $addToSet: { dislikes: userId }, // Add dislike
                    $pull: { likes: userId }, // Remove like if exists
                };
            }
        }

        const updatedReview = await Room_Review.findByIdAndUpdate(reviewId, updateQuery, { new: true });

        return res.status(200).json({
            output: 1,
            message: "Review updated successfully",
            jsonResponse: updatedReview,
        });

    } catch (error) {
        console.error("Error in likeDislikeReview:", error);
        return res.status(500).json({ message: "Server error", error });
    }
};