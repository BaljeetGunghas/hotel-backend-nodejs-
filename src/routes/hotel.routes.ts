import { isAutheticated } from '../middlewares/isAuthenticated';
import * as ex from "express";
import { Request, Response } from "express";
import { addhotelReview, createHotel, deletespacificHotelbyHotelId, gethostHotelList, getHotelsList, getspacificHotelbyHotelId, getSpecificHotelDetailsByHotelId, updatespacificHotelbyHotelId } from '../Controller/hotel.controller';
import uploadMulti from '../Helper/uploadMulti';


const router = ex.Router();

router.post("/get-hotel-list", async (req: Request, res: Response) => { await getHotelsList(req, res) });
router.post("/get-specific-hotel", async (req: Request, res: Response) => { await getspacificHotelbyHotelId(req, res) });
router.post("/create-hotel", isAutheticated, async (req: Request, res: Response) => { await createHotel(req, res) });
router.put("/update-hotel", isAutheticated, uploadMulti, async (req: Request, res: Response) => { await updatespacificHotelbyHotelId(req, res) });
router.post("/get-host-hotelList",isAutheticated, async (req: Request, res: Response) => { await gethostHotelList(req, res) });
router.post("/delete-hotel", isAutheticated, async (req: Request, res: Response) => { await deletespacificHotelbyHotelId(req, res) });
router.post("/get-specific-hotel-details", async (req: Request, res: Response) => { await getSpecificHotelDetailsByHotelId(req, res) });
router.post("/add-hotel-review", async (req: Request, res: Response) => { await addhotelReview(req, res) });


export default router;