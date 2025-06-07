import jwt from "jsonwebtoken";

const authmiddleware = (roles = []) => {
  return (req, res, next) => {
    try {
      const token = req.header("Authorization")?.replace("Bearer ", "");

      // If no token, deny access
      if (!token) {
        return res.status(401).json({
          success: false,
          message: "No token provided. Authorization denied.",
        });
      }

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach decoded user to request
      req.user = decoded;

      // Role check (optional)
      if (roles.length > 0 && !roles.includes(req.user.role)) {
        return res.status(403).json({
          success: false,
          message: "Access Denied. Insufficient permissions.",
        });
      }

      next(); // Proceed to the next middleware or route handler
    } catch (error) {
      console.error("Auth Middleware Error:", error.message);
      return res.status(401).json({
        success: false,
        message: "Invalid token or authentication error.",
      });
    }
  };
};

export default authmiddleware;
