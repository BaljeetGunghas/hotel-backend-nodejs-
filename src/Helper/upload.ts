import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "./cloudinaryConfig";

type CloudinaryImageResource = {
    asset_id: string;
    public_id: string;
    folder: string;
    filename: string;
    format: string;
    version: number;
    resource_type: string;
    type: string;
    created_at: string;
    secure_url: string;
    url: string;
};



const deleteExistingImages = async (userID: string) => {
    try {
        const result = await cloudinary.search
            .expression(`folder:uploads/profile/Id_${userID}`)
            .max_results(10) // Fetch up to 10 images in the folder
            .execute();

        if (result.resources.length > 0) {
            const deletePromises = result.resources.map((image: CloudinaryImageResource) =>
                cloudinary.uploader.destroy(image.public_id)
            );
            await Promise.all(deletePromises);
        }
    } catch (error) {
        console.error("Cloudinary Deletion Error:", error);
    }
};

// Multer storage setup
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req: Express.Request, file: Express.Multer.File) => {
        const userID = (req as any).userID; // Make sure userID is available in the request
        await deleteExistingImages(userID); // Delete old images before upload

        return {
            folder: `uploads/profile/Id_${userID}`, // Cloudinary folder
            public_id: `${Date.now()}_${file.originalname}`, // Unique file name
            format: "png", // Convert all uploads to PNG
            overwrite: true, // Ensures existing images are replaced
        };
    },
});

const upload = multer({ storage });

export default upload;
