import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "./cloudinaryConfig";
import { Request } from "express";

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req: Request, file: Express.Multer.File) => {
    const userID = (req as any).userID;
    const hotelId = (req.body as any).hotelId;
    const room_id = (req.body as any)?.room_id;

    const folderpath = room_id ? `uploads/rooms/host-id_${userID}/Id_${room_id}` : `uploads/hotels/host-id_${userID}/Id_${hotelId}`;

    return {
      folder: folderpath, // Hotel-specific folder
      public_id: `${Date.now()}_${file.originalname}`, // Unique file name
      format: "png", // Convert to PNG
    };
  },
});

const uploadMulti = multer({ storage }).array("images", 5); // Accept up to 5 images

export default uploadMulti;