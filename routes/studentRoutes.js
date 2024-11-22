import express from "express";
import multer from "multer";
import {
  addStudent,
  getAllStudents,
  getStudentById,
  updateStudent,
  softDeleteStudent,
} from "../controllers/studentController.js";
import { protect } from "../middleware/auth.js"; 
const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/", protect, upload.single("profileImage"), addStudent);
router.get("/", getAllStudents);
router.get("/:id", getStudentById);
router.put("/:id", protect, upload.single("profileImage"), updateStudent);
router.delete("/:id", protect, softDeleteStudent);

export default router;

