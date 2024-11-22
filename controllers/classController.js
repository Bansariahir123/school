import Class from "../models/Class.js";
import Teacher from "../models/Teacher.js";

// Create a class
export const createClass = async (req, res, next) => {
    try {
      const { name, teacherId } = req.body;
  
      // Check if the teacher exists
      const teacherExists = await Teacher.findById(teacherId);
      if (!teacherExists) return res.status(404).json({ message: "Teacher not found" });
  
      // Check if the teacher is already assigned to another class
      const existingClass = await Class.findOne({ teacherId });
      if (existingClass) {
        return res.status(400).json({ message: "Teacher is already assigned to another class" });
      }
  
      // If teacher is not assigned to any class, create the new class
      const newClass = new Class({ name, teacherId });
      await newClass.save();
      
      // Return the created class
      res.status(201).json(newClass);
    } catch (err) {
      next(err);
    }
  };
  

// Get all classes with pagination
export const getAllClasses = async (req, res, next) => {
    try {
      const { page = 1, limit = 10 } = req.query;
      const classes = await Class.find()
        .populate("teacherId", "name email")
        .skip((page - 1) * limit)
        .limit(Number(limit));
      res.status(200).json(classes);
    } catch (err) {
      next(err);
    }
  };
  
  // Get a class by ID
  export const getClassById = async (req, res, next) => {
    try {
      const classObj = await Class.findById(req.params.id).populate("teacherId", "name email");
      if (!classObj) return res.status(404).json({ message: "Class not found" });
      res.status(200).json(classObj);
    } catch (err) {
      next(err);
    }
  };
  
  // Update a class
  export const updateClass = async (req, res, next) => {
    try {
      const { name, teacherId } = req.body;
      const updatedClass = await Class.findByIdAndUpdate(
        req.params.id,
        { name, teacherId },
        { new: true }
      );
  
      if (!updatedClass) return res.status(404).json({ message: "Class not found" });
  
      res.status(200).json(updatedClass);
    } catch (err) {
      next(err);
    }
  };
  
  // Delete a class
  export const deleteClass = async (req, res, next) => {
    try {
      const deletedClass = await Class.findByIdAndDelete(req.params.id);
      if (!deletedClass) return res.status(404).json({ message: "Class not found" });
  
      res.status(200).json({ message: "Class deleted successfully" });
    } catch (err) {
      next(err);
    }
  };
