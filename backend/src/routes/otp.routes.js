import { Router } from "express";
import { sendOtp, checkOtp } from "../controllers/otp.controller.js";

const router = Router();

router.post("/send", sendOtp);     // body: { aadhaarNo, ownerName, consent: true }
router.post("/verify", checkOtp);  // body: { aadhaarNo, otp }

export default router;
