import { isAutheticated } from '../middlewares/isAuthenticated';
import * as ex from "express";
import { Request, Response } from "express";
import { deleteImage } from '../Controller/deleteImage.controller';


const router = ex.Router();

router.post('/', isAutheticated, async (req: Request, res: Response) => { await deleteImage(req, res) });


export default router;