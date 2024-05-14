// Admin only
const { User, Role } = require("../models");

// Create user
const createUser = async (req, res) => {
  try {
    const { name, username, email, password, role_name } = req.body;
    if (!name || !username || !email || !password || !role_name) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const role = await Role.findOne({ where: { name: role_name } });
    if (!role) {
      return res.status(404).json({ error: "Role not found" });
    }

    const existingUser = await User.findOne({ where: { email: email } });
    if (existingUser) {
      return res.status(409).json({
        message: "Email already exists",
      });
    }

    const newUser = await User.create({
      name,
      username,
      email,
      password,
      role_id: role.id,
    });

    const userId = newUser.id;
    res.status(201).json({
      message: "Registration successful",
      newUser,
      userId: userId,
    });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

// Get a user by id
const getUserById = async (req, res) => {
  const id = req.params.id;
  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({
        message: `User with id ${id} does not exist`,
      });
    }

    res.status(200).json({
      message: "User retrieved successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "Something went wrong",
    });
  }
};

const getStudents = async (req, res) => {
  try {
    const students = await User.findAll({ where: { role_id: 2 } });
    if (students.length === 0) {
      return res
        .status(404)
        .json({ message: "No students found in the database" });
    }

    return res.status(200).json({
      message: "Students successfully retrieved",
      students,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "Something went wrong",
    });
  }
};

const getTeachers = async (req, res) => {
  try {
    const teachers = await User.findAll({ where: { role_id: 3 } });

    if (teachers.length === 0) {
      return res
        .status(404)
        .json({ message: "No teachers found in the database" });
    }
    res.status(200).json({
      message: "Teachers successfully retrieved",
      teachers,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "Something went wrong",
    });
  }
};

const updateUser = async (req, res) => {
  const id = req.params.id;
  const { name, email, role_name } = req.body;

  try {
    let user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({
        message: `User with the id ${id} does not exist`,
      });
    }

    const role = await Role.findOne({ where: { name: role_name } });
    if (!role) {
      return res.status(404).json({ error: "Role not found" });
    }

    user.name = name;
    user.email = email;
    user.role_id = role.id;

    await user.save();

    res.status(200).json({
      message: "User updated successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "Something went wrong",
    });
  }
};

const deleteUser = async (req, res) => {
  const id = req.params.id;
  try {
    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({
        message: `User with the id ${id} does not exist`,
      });
    }

    await user.destroy();

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Something went wrong",
      error,
    });
  }
};

// const allUsers = async (req, res) => {
//   const keyword = req.query.search;

//   console.log(keyword);
// };

module.exports = {
  createUser,
  getUserById,
  getStudents,
  getTeachers,
  updateUser,
  deleteUser,
};
