import jwt from "jsonwebtoken";

export const requireAuth = (allowedRoles = []) => {
  return (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1];

    try {
      const jwtSecret =
        process.env.JWT_SECRET || "fallback-jwt-secret-for-development";
      const decoded = jwt.verify(token, jwtSecret);
      req.user = decoded;

      if (allowedRoles.length && !allowedRoles.includes(decoded.role)) {
        return res.status(403).json({ message: "Forbidden: Access denied" });
      }

      next();
    } catch (err) {
      res.status(401).json({ message: "Invalid or expired token" });
    }
  };
};

export default requireAuth;
