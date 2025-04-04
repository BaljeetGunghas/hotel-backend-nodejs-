import { isAutheticated } from '../middlewares/isAuthenticated';
import * as ex from "express";
import { Request, Response } from "express";
import { addRoomReview, createRoom, deleteRoom, getAllRooms, gethostAllRoom, getRoomsByHotel, getSingleSearchRoom, getSpacificCompleteRoombyRoomId, getSpacificRoombyRoomId, likeDislikeReview, searchRooms, shortListRoom, updateRoom } from '../Controller/room.controller';
import uploadMulti from '../Helper/uploadMulti';

const router = ex.Router();
router.post("/get-allroom-list", async (req: Request, res: Response) => { await getAllRooms(req, res) });
router.get("/search-room", async (req: Request, res: Response) => { await searchRooms(req, res) });
router.post("/getSingleSearchRoom",isAutheticated, async (req: Request, res: Response) => { await getSingleSearchRoom(req, res) });
router.post("/get-host-all-room", isAutheticated, async (req: Request, res: Response) => { await gethostAllRoom(req, res) })
router.post("/get-specific-room-fulldetails", async (req: Request, res: Response) => { await getSpacificCompleteRoombyRoomId(req, res) });
router.post("/get-specific-room-details", async (req: Request, res: Response) => { await getSpacificRoombyRoomId(req, res) });
router.post("/create-room", isAutheticated, async (req: Request, res: Response) => { await createRoom(req, res) });
router.put("/update-roomby-roomid", isAutheticated, uploadMulti, async (req: Request, res: Response) => { await updateRoom(req, res) });
router.post("/delete-roomby-roomid", isAutheticated, async (req: Request, res: Response) => { await deleteRoom(req, res) });
router.post("/update-room-shortlist", isAutheticated, async (req: Request, res: Response) => { await shortListRoom(req, res) });
router.post("/get-rooms-by-hotel", async (req: Request, res: Response) => {
    await getRoomsByHotel(req, res);
});
router.post("/add-room-review", isAutheticated, async (req: Request, res: Response) => {
    await addRoomReview(req, res);
});
router.post("/likeDislikeReview", isAutheticated, async (req: Request, res: Response) => { await likeDislikeReview(req, res) });




export default router;