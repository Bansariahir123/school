import express from "express";
import multer from "multer";
import {
  addTeacher,
  getAllTeachers,
  getTeacherById,
  updateTeacher,
  softDeleteTeacher,
} from "../controllers/teacherController.js";
import { protect } from "../middleware/auth.js"; 
const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/", protect, upload.single("profileImage"), addTeacher);
router.get("/", getAllTeachers);
router.get("/:id", getTeacherById);
router.put("/:id", protect, upload.single("profileImage"), updateTeacher);
router.delete("/:id", protect, softDeleteTeacher);

export default router;
