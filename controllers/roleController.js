const { Role } = require("../models");

// Create role
const createRole = async (req, res) => {
  const { name } = req.body;

  try {
    const existingRole = await Role.findOne({ where: { name: name } });

    if (existingRole) {
      return res.status(409).json({
        message: "Role already exists",
      });
    }

    const newRole = await Role.create({
      name,
    });
    return res.status(201).json({
      message: "Role created successfully",
      newRole,
    });
  } catch (error) {
    console.error("Error creating role:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

const getAllRoles = async (req, res) => {
  try {
    const roles = await Role.findAll();

    if (roles.length === 0) {
      return res.status(200).json({
        message: "No roles found in the database",
        roles: [],
      });
    }

    res.status(200).json({
      message: "Roles retrieved successfully",
      roles,
    });
  } catch (error) {
    console.error("Error fetching roles:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
};


// Update role
const updateRole = async (req, res) => {
  const id = req.params.id;
  const { name } = req.body;

  try {
    let role = await Role.findByPk(id);

    if (!role) {
      return res.status(404).json({
        message: `Role with id ${id} not found`,
      });
    }

    if (name) {
      role.name = name;
    } else {
      
    }

    await role.save();

    res.status(200).json({
      message: "Role updated successfully",
      role,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "Something went wrong",
    });
  }
};

// Delete role
const deleteRole = async (req, res) => {
  const id = req.params.id;
  try {
    const role = await Role.findByPk(id);

    if (!role) {
      return res.status(404).json({
        message: `Role with the id ${id} does not exist`,
      });
    }

    await role.destroy();

    res.status(200).json({ message: "Role deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Something went wrong",
    });
  }
};

module.exports = {
  createRole,
  updateRole,
  deleteRole,
  getAllRoles,
};
