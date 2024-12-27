import { isAutheticated } from './../middlewares/isAuthenticated';
import * as ex from "express";
import { Request, Response } from "express";
import { addRoomReview, createRoom, deleteRoom, getAllRooms, getRoomsByHotel, getSpacificRoombyRoomId, updateRoom } from '../Controller/room.controller';

const router = ex.Router();
router.post("/get-allroom-list", async (req: Request, res: Response) => { await getAllRooms(req, res) });
router.post("/get-specific-room-details", async (req: Request, res: Response) => { await getSpacificRoombyRoomId(req, res) });
router.post("/create-room", isAutheticated, async (req: Request, res: Response) => { await createRoom(req, res) });
router.put("/update-roomby-roomid", isAutheticated, async (req: Request, res: Response) => { await updateRoom(req, res) });
router.post("/delete-roomby-roomid", isAutheticated, async (req: Request, res: Response) => { await deleteRoom(req, res) });
router.post("/get-rooms-by-hotel", async (req: Request, res: Response) => {
    await getRoomsByHotel(req, res);
});
router.post("/add-room-review", async (req: Request, res: Response) => {
    await addRoomReview(req, res);
});





export default router;