import { logger } from "../utils/winston.js";
import { compare, encript } from "../utils/bcrypt.js";
import prisma from "../utils/client.js";
import {
  generateAccessToken,
  generateRefreshToken,
  parseJwt,
  verifyRefreshToken,
} from "../utils/jwt.js";
import {
  userUpdateValidation,
  userValidation,
} from "../validations/user.validation.js";

/**
 * Create new user
 */
export const createUser = async (req, res) => {
  const { error, value } = userValidation(req.body);
  if (error) {
    return res.status(400).json({
      message: error.details[0].message,
      result: null,
    });
  }

  try {
    // Check if username already exists
    const existingUser = await prisma.user.findUnique({
      where: { userName: value.userName },
    });
    if (existingUser) {
      return res.status(409).json({
        message: "Username already exists",
        result: null,
      });
    }

    const hashedPassword = encript(value.password);
    const newUser = await prisma.user.create({
      data: {
        name: value.name,
        userName: value.userName,
        password: hashedPassword,
        role: value.role,
      },
    });

    delete newUser.password;

    return res.status(201).json({
      message: "User created successfully",
      result: newUser,
    });
  } catch (error) {
    logger.error(`createUser - ${error.message}`);
    return res.status(500).json({
      message: error.message,
      result: null,
    });
  }
};

/**
 * Update user by ID
 */
export const updateUser = async (req, res) => {
  const { id } = req.params;
  const { error, value } = userUpdateValidation(req.body);

  if (error) {
    return res.status(400).json({
      message: error.details[0].message,
      result: null,
    });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: Number(id) },
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        result: null,
      });
    }

    const updatedUser = await prisma.user.update({
      where: { id: Number(id) },
      data: {
        name: value.name,
        userName: value.userName,
        password: value.password ? encript(value.password) : user.password,
        role: value.role,
      },
    });

    delete updatedUser.password;

    return res.status(200).json({
      message: "User updated successfully",
      result: updatedUser,
    });
  } catch (error) {
    logger.error(`updateUser - ${error.message}`);
    return res.status(500).json({
      message: error.message,
      result: null,
    });
  }
};

/**
 * Delete user by ID
 */
export const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const existing = await prisma.user.findUnique({
      where: { id: Number(id) },
    });
    if (!existing) {
      return res.status(404).json({
        message: "User not found",
        result: null,
      });
    }

    await prisma.user.delete({
      where: { id: Number(id) },
    });

    return res.status(200).json({
      message: "User deleted successfully",
      result: null,
    });
  } catch (error) {
    logger.error(`deleteUser - ${error.message}`);
    return res.status(500).json({
      message: error.message,
      result: null,
    });
  }
};

/**
 * Get all users
 */
export const getAllUser = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      orderBy: { id: "desc" },
      select: {
        id: true,
        name: true,
        userName: true,
        role: true,
      },
    });

    return res.status(200).json({
      message: "success",
      result: users,
    });
  } catch (error) {
    logger.error(`getAllUser - ${error.message}`);
    return res.status(500).json({
      message: error.message,
      result: null,
    });
  }
};

/**
 * Get user by ID
 */
export const getUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await prisma.user.findUnique({
      where: { id: Number(id) },
      select: {
        id: true,
        name: true,
        userName: true,
        role: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        result: null,
      });
    }

    return res.status(200).json({
      message: "success",
      result: user,
    });
  } catch (error) {
    logger.error(`getUserById - ${error.message}`);
    return res.status(500).json({
      message: error.message,
      result: null,
    });
  }
};

/**
 * User login
 */
export const loginUser = async (req, res) => {
  const { userName, password } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: { userName },
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        result: null,
      });
    }

    const validPassword = compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({
        message: "Invalid password",
        result: null,
      });
    }

    delete user.password;

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    return res.status(200).json({
      message: "Login success",
      result: user,
      accessToken,
      refreshToken,
    });
  } catch (error) {
    logger.error(`loginUser - ${error.message}`);
    return res.status(500).json({
      message: error.message,
      result: null,
    });
  }
};

/**
 * Refresh access token
 */
export const setRefreshToken = async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        message: "No token provided",
        result: null,
      });
    }

    const isValid = verifyRefreshToken(token);
    if (!isValid) {
      return res.status(401).json({
        message: "Invalid refresh token",
        result: null,
      });
    }

    const data = await parseJwt(token);
    const user = await prisma.user.findUnique({
      where: { userName: data.userName },
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        result: null,
      });
    }

    delete user.password;

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    return res.status(200).json({
      message: "Token refreshed successfully",
      result: user,
      accessToken,
      refreshToken,
    });
  } catch (error) {
    logger.error(`setRefreshToken - ${error.message}`);
    return res.status(500).json({
      message: error.message,
      result: null,
    });
  }
};
