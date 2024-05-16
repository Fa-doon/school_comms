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
    const userResponse = newUser.get({ plain: true });
    delete userResponse.password;

    res.status(201).json({
      message: "Registration successful",
      newUser: userResponse,
      userId: userId,
    });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

// Get a user by role name
const getUsersByRolename = async (req, res) => {
  const { role_name } = req.params;
  try {
    const role = await Role.findOne({ where: { name: role_name } });

    if (!role) {
      return res.status(404).json({
        message: `Role name with name - ${role_name} does not exist`,
      });
    }

    const users = await User.findAll({ where: { role_id: role.id } });

    res.status(200).json({
      message: `${role_name} users successfully retrieved`,
      users,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "Something went wrong",
    });
  }
};

// Get user by id
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
    const role = await Role.findOne({ where: { name: "student" } });
    if (!role) {
      return res.status(404).json({ message: "Role 'student' not found" });
    }

    const students = await User.findAll({
      where: { role_id: role.id },
      attributes: { exclude: ["password"] },
    });
    if (students.length === 0) {
      return res.status(200).json({
        message: "No students found in the database",
        students: [],
      });
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
    const role = await Role.findOne({ where: { name: "teacher" } });
    if (!role) {
      return res.status(404).json({ message: "Role 'teacher' not found" });
    }

    const teachers = await User.findAll({
      where: { role_id: role.id },
      attributes: { exclude: ["password"] },
    });
    if (teachers.length === 0) {
      return res.status(200).json({
        message: "No teachers found in the database",
        teachers: [],
      });
    }

    return res.status(200).json({
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
  const { name, username, email, role_name } = req.body;

  try {
    let user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({
        message: `User with the id ${id} does not exist`,
      });
    }

    if (name) {
      user.name = name;
    }
    if (username) {
      user.username = username;
    }
    if (email) {
      user.email = email;
    }

    if (role_name) {
      const role = await Role.findOne({ where: { name: role_name } });
      if (!role) {
        return res.status(404).json({ error: "Role not found" });
      }
      user.role_id = role.id;
    }

    await user.save();

    const { password, ...updatedUser } = user.toJSON();

    res.status(200).json({
      message: "User updated successfully",
      user: updatedUser,
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
  getUsersByRolename,
  getUserById,
  getStudents,
  getTeachers,
  updateUser,
  deleteUser,
};
