import express from "express";
import { addLetter, getLetters } from "../controllers/Letter.js";

const router = express.Router();

router.post("/letter", addLetter);
router.get("/letters", getLetters);

export default router;
