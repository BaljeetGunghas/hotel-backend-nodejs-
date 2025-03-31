import { isAutheticated } from '../middlewares/isAuthenticated';
import * as ex from "express";
import { Request, Response } from "express";
import { createContactUs } from '../Controller/contactus.controller';


const router = ex.Router();
router.get('/', async (req: Request, res: Response) => { res.json({ message: 'get req' }) });
router.post('/create-contactus', async (req: Request, res: Response) => { await createContactUs(req, res) });
// router.post('/get-bookingbyId', isAutheticated, async (req: Request, res: Response) => { await getBookingById(req, res) });

export default router;