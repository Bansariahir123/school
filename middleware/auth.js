import jwt from "jsonwebtoken";

export const protect = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Unauthorized" });
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded; // Attach user info to request object
  
      // Check if the user is an admin
      if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Forbidden, admin access required" });
      }
  
      next();
    } catch (err) {
      res.status(401).json({ message: "Invalid Token" });
    }
  };
  


