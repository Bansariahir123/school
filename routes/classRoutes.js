import express from "express";
import {
  createClass,
  getAllClasses,
  getClassById,
  updateClass,
  deleteClass,
} from "../controllers/classController.js";
import { protect } from "../middleware/auth.js"; 
const router = express.Router();

router.post("/", protect, createClass);
router.get("/", getAllClasses);
router.get("/:id", getClassById);
router.put("/:id", protect, updateClass);
router.delete("/:id", protect, deleteClass);

export default router;
