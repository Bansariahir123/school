import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs"; // For hashing password
import Admin from "../models/Admin.js"; // Assuming you have an Admin model


// Register a new admin
export const register = async (req, res, next) => {
    try {
      const { name, email, password } = req.body;
  
      // Check if the admin already exists
      const existingAdmin = await Admin.findOne({ email });
      if (existingAdmin) {
        return res.status(400).json({ message: "Admin already exists" });
      }
  
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Create a new admin
      const newAdmin = new Admin({
        name,
        email,
        password: hashedPassword,
      });
  
      // Save the new admin to the database
      await newAdmin.save();
  
      // Create a JWT token for the new admin
      const token = jwt.sign(
        { id: newAdmin._id, email: newAdmin.email, role: "admin" }, // Payload
        process.env.JWT_SECRET, // Secret key
        { expiresIn: "1d" } // Token expiry time
      );
  
      // Send the token as response
      res.status(201).json({ token });
    } catch (err) {
      next(err);
    }
  };


// Login for admin (or user)
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find the admin by email (assuming you have an Admin model)
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    // Check if password matches
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    // Create a JWT token
    const token = jwt.sign(
      { id: admin._id, email: admin.email, role: "admin" }, // Payload
      process.env.JWT_SECRET, // Secret key
      { expiresIn: "1h" } // Token expiry time
    );

    // Send the token as response
    res.status(200).json({ token });
  } catch (err) {
    next(err);
  }
};
