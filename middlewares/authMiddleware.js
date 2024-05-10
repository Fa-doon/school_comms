const jwt = require("jsonwebtoken");
const { User } = require("../models");

const isAdmin = async (req, res, next) => {
  try {
    const body = req.headers.authorization;

    if (!body) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const token = await body.split(" ")[1];
    const decoded = await jwt.verify(token, process.env.JWT_KEY);
    const user = await User.findOne({ where: { username: decoded.username } });

    if (!user) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    if (user.role_id !== 1) {
      return res.status(403).json({
        message: "Forbidden - Admin access required",
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

const isUser = async (req, res, next) => {
  try {
    const body = req.headers.authorization;

    if (!body) {
      return res.status(401).json({
        message: "You cannot perform this operation",
      });
    }

    const token = await body.split(" ")[1];
    const decoded = await jwt.verify(token, process.env.JWT_KEY);
    const user = await User.findOne({ where: { id: decoded.id } });

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
