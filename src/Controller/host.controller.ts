import { Request, Response } from "express";
import { Hotel, IHotel } from "../Model/hotel.model";


export const hostDashboard = async (req: Request, res: Response) => {
    try {
        const { hostId } = req.body;

        if (!hostId) {
            return res.status(400).json({
                output: 0,
                message: "Host ID is required",
            });
        }

        // Get hotel count
        const hotelCount = await Hotel.countDocuments({ hostid: hostId });

        // Fetch all ratings for proper average calculation
        const hotels = await Hotel.find({ hostid: hostId }, { rating: 1 }); // Fetch only ratings
        const ratingArr = hotels.map((h: IHotel) => h.rating).filter((r) => typeof r === "number");

        // Calculate average rating
        const avgRating = ratingArr.length > 0
            ? +(ratingArr.reduce((sum, rating) => sum + rating, 0) / ratingArr.length).toFixed(1)
            : 0;

        // Fetch limited hotels for display
        const totalHotels = await Hotel.find({ hostid: hostId }).limit(2);

        return res.status(200).json({
            output: 1,
            message: "ok",
            jsonResponse: {
                hotelCount,
                avgRating,
                hotels: totalHotels,
            },
        });
    } catch (error) {
        res.status(500).json({
            output: 0,
            message: (error as Error).message,
        });
    }
};

export const getHostHotelName = async (req: Request, res: Response) => {
    try {
        const hostid = req.userID;
        if (!hostid) {
            return res.status(200).json({
                output: 0,
                message: "Host_id is missing",
                jsonResponse: null,
            });
        }
        const hotelNameData = await Hotel.find({ hostid }).select('_id, name');
        if (hotelNameData.length > 0) {

            return res.status(200).json({
                output: 1,
                message: 'ok',
                jsonResponse: hotelNameData
            })
        } else {
            return res.status(200).json({
                output: 0,
                message: 'No hotels found',
                jsonResponse: null
            })
        }


    } catch (error) {
        return res.status(500).json({
            output: 0,
            message: (error as Error).message,
            jsonResponse: null,
        });
    }
}