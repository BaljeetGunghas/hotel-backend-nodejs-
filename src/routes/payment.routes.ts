import { isAutheticated } from '../middlewares/isAuthenticated';
import * as ex from "express";
import { Request, Response } from "express";
import { createPayment, verifyPayment } from '../Controller/payment';


const router = ex.Router();

router.post('/create-payment', isAutheticated, async (req: Request, res: Response) => { await createPayment(req, res) });
router.post('/verify-payment', isAutheticated, async (req: Request, res: Response) => { await verifyPayment(req, res) });



export default router;