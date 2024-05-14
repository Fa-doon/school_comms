const { User } = require("../models");
const jwt = require("jsonwebtoken");

const loginUser = async (req, res) => {
  try {
    const userInfo = {
      email: req.body.email,
      password: req.body.password,
    };

    const existingUser = await User.findOne({
      where: { email: userInfo.email },
    });
    if (!existingUser) {
      return res.status(401).json({
        message: "Email or password incorrect",
      });
    }

    const isMatch = await existingUser.isValidPassword(userInfo.password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Email or password incorrect",
      });
    }

    if (existingUser.role_id === 1) {
      // generate jwt for admin
      const token = await jwt.sign(
        {
          email: existingUser.email,
          username: existingUser.username,
          id: existingUser.id,
        },
        process.env.JWT_KEY,
        { expiresIn: "1d" }
      );

      return res.status(200).json({
        message: "Login successful",
        token,
      });
    } else {
      // generate jwt for other users
      const token = await jwt.sign(
        {
          email: existingUser.email,
          created_at: existingUser.created_at,
          id: existingUser.id,
          username: existingUser.username,
        },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );
      return res.status(200).json({
        message: "Login successful",
        token,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "Something went wrong",
      error,
    });
  }
};

module.exports = {
  loginUser,
};
