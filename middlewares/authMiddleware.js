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

    const token = body.split(" ")[1];
    let decoded;
    try {
      decoded =  jwt.verify(token, process.env.JWT_KEY);
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

    const token = body.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
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


const decodeUser = async (req, res, next) => {
  try {
    const body = req.headers.authorization;

    if (!body) {
      return res.status(401).json({
        message: "Unauthorized, no token provided",
      });
    }

    const token = body.split(" ")[1];
    let decoded;

  // checking for non admin users
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (errUser) {
      // cecking for admin users - on fail
      try {
        decoded = jwt.verify(token, process.env.JWT_KEY);
      } catch (errAdmin) {
        return res.status(403).json({
          message: "Forbidden - Invalid or expired token",
        });
      }
    }

    const user = await User.findOne({
      where: { id: decoded.id },
      attributes: { exclude: ["password"] },
      include: [{ model: Role, attributes: ["name"] }],
    });

    if (!user) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Error in decodeUser middleware:", error);
    res.status(500).json({
      message: "Failed to authenticate token",
    });
  }
};


module.exports = { isAdmin, isUser, decodeUser  };
