import { Request, Response } from "express";
import { Hotel, IHotel } from "../Model/hotel.model";



export const hostDashboard = async (req: Request, res: Response) => {
    try {
        const { hostId } = req.body;
        //hotel count with this host id 
        const totalHotels = await Hotel.find({ hostid: hostId });
        const hotelCount = totalHotels.length;

        // Calculate average rating of hotels
        const ratingArr = totalHotels.map((h: IHotel) => h.rating);

        // Calculate average rating
        const avgRating =
            ratingArr.length > 0
                ? +(ratingArr.reduce((sum, rating) => sum + rating, 0) / ratingArr.length).toFixed(1)
                : 0;




        return res.status(200).json({
            output: 1,
            message: 'ok',
            jsonResponse: {
                hotelCount,
                avgRating,
                hotels: totalHotels
            }

        })

    } catch (error) {
        res.status(500).json({
            output: 0,
            message: (error as Error).message,
        });
    }
}