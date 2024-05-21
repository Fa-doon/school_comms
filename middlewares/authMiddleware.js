const jwt = require("jsonwebtoken");
const { User, Role } = require("../models");

const isAdmin = async (req, res, next) => {
  try {
    const body = req.headers.authorization;

    if (!body) {
      return res.status(401).json({
        message: "Unauthorized, no token provided",
      });
    }

    const token = await body.split(" ")[1];
    let decoded;
    try {
      decoded = await jwt.verify(token, process.env.JWT_KEY);
    } catch (error) {
      return res.status(403).json({
        message: "Forbidden - Invalid or expired token",
      });
    }
    const user = await User.findOne({
      where: { username: decoded.username },
    });

    if (!user) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

const isUser = async (req, res, next) => {
  try {
    const body = req.headers.authorization;

    if (!body) {
      return res.status(401).json({
        message: "You cannot perform this operation",
      });
    }

    const token = await body.split(" ")[1];
    const decoded = await jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({
      where: { id: decoded.id },
      attributes: { exclude: ["password"] },
      include: [{ model: Role, attributes: ["name"] }],
    });

    if (!user) {
      return res.status(401).json({
        message: "You cannot perform this operation",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({
      message: "Incorrect or expired token",
    });
  }
};

module.exports = { isAdmin, isUser };
