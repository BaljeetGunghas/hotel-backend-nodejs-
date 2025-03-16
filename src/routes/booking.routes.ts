import { isAutheticated } from '../middlewares/isAuthenticated';
import * as ex from "express";
import { Request, Response } from "express";
import { createBooking } from '../Controller/booking.controller';


const router = ex.Router();
router.get('/', async (req: Request, res: Response) => { res.json({ message: 'get req' }) });
router.post('/create-booking', isAutheticated, async (req: Request, res: Response) => { await createBooking(req, res) });

export default router;