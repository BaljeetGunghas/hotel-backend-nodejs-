import { isAutheticated } from '../middlewares/isAuthenticated';
import * as ex from "express";
import { Request, Response } from "express";



import { checkAuth, deleteUser, forgotPassword, isUserRegistered, login, logout, resetEmailVerificationToken, resetPassword, signup, updateProfile, VerifyEmail } from '../Controller/user.controller';

const router = ex.Router();

router.get("/check-auth", isAutheticated, async (req: Request, res: Response) => { await checkAuth(req, res) });

router.post("/signup", async (req: Request, res: Response) => { await signup(req, res) });
router.post("/login", async (req: Request, res: Response) => { await login(req, res) });
router.post("/isUserRegistered", async (req: Request, res: Response) => { await isUserRegistered(req, res) });
router.post("/logout", async (req: Request, res: Response) => { await logout(req, res) });

router.post("/verfication-email-token-reset", async (req: Request, res: Response) => { await resetEmailVerificationToken(req, res) });
router.post("/verify-email", async (req: Request, res: Response) => { await VerifyEmail(req, res) });

router.post("/forget-password", async (req: Request, res: Response) => { await forgotPassword(req, res) });
router.post("/reset-password", async (req: Request, res: Response) => { await resetPassword(req, res) });

router.put("/profile/update", isAutheticated, async (req: Request, res: Response) => { await updateProfile(req, res) });


export default router;