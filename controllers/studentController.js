import Student from "../models/Student.js";
import Class from "../models/Class.js";
import cloudinary from "../utils/cloudinary.js";

// Add a student
export const addStudent = async (req, res, next) => {
    try {
      const { name, email, classId } = req.body;
  
      // Check if the student already exists by email
      const existingStudent = await Student.findOne({ email });
      if (existingStudent) {
        return res.status(400).json({ message: "Student with this email already exists" });
      }
  
      const profileImageUrl = req.file
        ? (await cloudinary.uploader.upload(req.file.path)).secure_url
        : null;
  
      const student = new Student({ name, email, classId, profileImageUrl });
      await student.save();
  
      // Increment student count in the class
      await Class.findByIdAndUpdate(classId, { $inc: { studentCount: 1 } });
  
      res.status(201).json(student);
    } catch (err) {
      if (err.code === 11000) {
        return res.status(400).json({ message: "Email already exists" });
      }
      next(err);
    }
  };

// Get all students (with pagination and class filtering)
export const getAllStudents = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, classId } = req.query;
    const query = classId ? { classId } : {};
    const students = await Student.find(query)
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .populate("classId", "name");
    res.status(200).json(students);
  } catch (err) {
    next(err);
  }
};

// Get a single student by ID
export const getStudentById = async (req, res, next) => {
    try {
      const student = await Student.findById(req.params.id).populate("classId", "name");
      if (!student) return res.status(404).json({ message: "Student not found" });
      res.status(200).json(student);
    } catch (err) {
      next(err);
    }
  };
  
  // Update a student
  export const updateStudent = async (req, res, next) => {
    try {
      const { name, classId } = req.body;
  
      const updatedFields = { name, classId };
  
      if (req.file) {
        const result = await cloudinary.uploader.upload(req.file.path);
        updatedFields.profileImageUrl = result.secure_url;
      }
  
      const student = await Student.findByIdAndUpdate(req.params.id, updatedFields, { new: true });
  
      if (!student) return res.status(404).json({ message: "Student not found" });
  
      res.status(200).json(student);
    } catch (err) {
      next(err);
    }
  };
  
  // Soft delete a student
  export const softDeleteStudent = async (req, res, next) => {
    try {
      const student = await Student.findByIdAndUpdate(
        req.params.id,
        { deleted: true },
        { new: true }
      );
  
      if (!student) return res.status(404).json({ message: "Student not found" });
  
      // Decrement student count in the class
      await Class.findByIdAndUpdate(student.classId, { $inc: { studentCount: -1 } });
  
      res.status(200).json({ message: "Student deleted successfully" });
    } catch (err) {
      next(err);
    }
  };
