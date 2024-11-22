import Teacher from "../models/Teacher.js";
import cloudinary from "../utils/cloudinary.js";

// Add a teacher
// Add a teacher
export const addTeacher = async (req, res, next) => {
    try {
      const { name, email, subject } = req.body;
  
      // Check if the teacher already exists by email
      const existingTeacher = await Teacher.findOne({ email });
      if (existingTeacher) {
        return res.status(400).json({ message: "Teacher with this email already exists" });
      }
  
      const profileImageUrl = req.file
        ? (await cloudinary.uploader.upload(req.file.path)).secure_url
        : null;
  
      const teacher = new Teacher({ name, email, subject, profileImageUrl });
      await teacher.save();
  
      res.status(201).json(teacher);
    } catch (err) {
      if (err.code === 11000) {
        return res.status(400).json({ message: "Email already exists" });
      }
      next(err);
    }
  };
  

// Get all teachers with pagination
export const getAllTeachers = async (req, res, next) => {
    try {
      const { page = 1, limit = 10 } = req.query;
      const teachers = await Teacher.find()
        .skip((page - 1) * limit)
        .limit(Number(limit));
      res.status(200).json(teachers);
    } catch (err) {
      next(err);
    }
  };
  
  // Get a teacher by ID
  export const getTeacherById = async (req, res, next) => {
    try {
      const teacher = await Teacher.findById(req.params.id);
      if (!teacher) return res.status(404).json({ message: "Teacher not found" });
      res.status(200).json(teacher);
    } catch (err) {
      next(err);
    }
  };
  
  // Update a teacher
  export const updateTeacher = async (req, res, next) => {
    try {
      const { name, subject } = req.body;
  
      const updatedFields = { name, subject };
  
      if (req.file) {
        const result = await cloudinary.uploader.upload(req.file.path);
        updatedFields.profileImageUrl = result.secure_url;
      }
  
      const teacher = await Teacher.findByIdAndUpdate(req.params.id, updatedFields, { new: true });
  
      if (!teacher) return res.status(404).json({ message: "Teacher not found" });
  
      res.status(200).json(teacher);
    } catch (err) {
      next(err);
    }
  };
  
  // Soft delete a teacher
  export const softDeleteTeacher = async (req, res, next) => {
    try {
      const teacher = await Teacher.findByIdAndUpdate(
        req.params.id,
        { deleted: true },
        { new: true }
      );
  
      if (!teacher) return res.status(404).json({ message: "Teacher not found" });
  
      res.status(200).json({ message: "Teacher deleted successfully" });
    } catch (err) {
      next(err);
    }
  };
