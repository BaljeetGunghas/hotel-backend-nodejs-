import { Hotel } from "../Model/hotel.model";

export async function getHotelByCity(city: string) {
    const properties = await Hotel.find({ city: city }).select("_id");
    return properties.map((p) => p._id);
}
