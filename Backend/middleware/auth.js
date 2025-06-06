import jwt from "jsonwebtoken";

const authmiddleware = (roles = []) => {
  return (req, res, next) => {
    try {
      const token = req.header("Authorization")?.replace("Bearer ", "");
      if (!token) {
        res
          .status(401)
          .json({
            success: false,
            message: "Not token, Authoorization denied",
          });
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded) {
          req.user = decoded;
          if (roles.length > 0 && !roles.includes(req.user.role)) {
            return res
              .status(403)
              .json({ success: false, message: "Access Denied." });
          }
          next();
        }
      }
    } catch (error) {}
  };
};


export default authmiddleware;