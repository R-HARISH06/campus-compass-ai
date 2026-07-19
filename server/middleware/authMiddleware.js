const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  if (!process.env.JWT_SECRET) {
    return res.status(503).json({ message: "Authentication is not configured on the server." });
  }

  const authHeader = req.headers.authorization || "";
  const [scheme, token] = authHeader.split(" ");
  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({ message: "Access denied. Use a Bearer token." });
  }

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (error) {
    return res.status(403).json({ message: "Invalid or expired token." });
  }
};

const verifyMasterAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.role !== "master_admin") {
      return res.status(403).json({ message: "Access denied. Master Admins only." });
    }
    next();
  });
};

const verifyDataAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.role !== "data_admin" && req.user.role !== "master_admin") {
      return res.status(403).json({ message: "Access denied. Data Admins only." });
    }
    next();
  });
};

const verifyClubAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.role !== "club_admin" && req.user.role !== "master_admin") {
      return res.status(403).json({ message: "Access denied. Club Admins only." });
    }
    next();
  });
};

const verifyCafeOwner = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.role !== "cafe_owner" && req.user.role !== "master_admin" && req.user.role !== "data_admin") {
      return res.status(403).json({ message: "Access denied. Cafe Owners only." });
    }
    next();
  });
};

module.exports = { verifyToken, verifyMasterAdmin, verifyDataAdmin, verifyClubAdmin, verifyCafeOwner };