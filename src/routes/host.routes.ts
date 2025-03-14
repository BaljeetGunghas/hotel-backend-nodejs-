import { isAutheticated } from '../middlewares/isAuthenticated';
import * as ex from "express";
import { Request, Response } from "express";
import { getHostHotelName, hostDashboard } from '../Controller/host.controller';


const router = ex.Router();

router.post('/host-dashboard', isAutheticated, async (req: Request, res: Response) => { await hostDashboard(req, res) });
router.post('/getHostHotelName', isAutheticated, async (req: Request, res: Response) => { await getHostHotelName(req, res) });

export default router;