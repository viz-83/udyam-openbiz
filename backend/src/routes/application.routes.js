import { Router } from "express";
import { submitStep2 } from "../controllers/application.controller.js";

const router = Router();

// Final submission (Step 2)
router.post("/submit", submitStep2);

export default router;
