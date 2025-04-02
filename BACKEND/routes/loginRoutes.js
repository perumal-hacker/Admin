import express from "express";
import loginUser from "../controllers/login/login.js";

const router = express.Router();

router.post("/google/callback", loginUser);

export default router;