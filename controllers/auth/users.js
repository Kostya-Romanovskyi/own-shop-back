const jwt = require("jsonwebtoken");
require("dotenv").config();
const bcrypt = require("bcrypt");
const path = require("path");
const { cloudinary, getCloudOptions } = require("../../config/cloudinary");
const { Op } = require("sequelize");
const { User, schemas } = require("../../models/users");
const { Orders } = require("../../models/orders");
const { OrderItems } = require("../../models/orderItems");
const fs = require("fs/promises");

const { SECRET_KEY } = process.env;

const cloudOptions = {
  public_id: `${Date.now()}`,
  use_filename: true,
  unique_filename: false,
  overwrite: true,
};

const getAllUsers = async (req, res) => {
  try {
    const page = req.query.page || 1;
    const limit = parseInt(req.query.limit) || 10;

    if (isNaN(page) || isNaN(limit)) {
      return res.status(400).json({ error: "Invalid page or limit parameter" });
    }

    const users = await User.findAll({
      limit,
      offset: (page - 1) * limit,
      include: [{ model: Orders, include: [{ model: OrderItems }] }],
    });

    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Error fetching users" });
  }
};

const register = async (req, res) => {
  try {
    const validationResult = schemas.registerSchema.validate(req.body);

    if (validationResult.error) {
      res.status(400).json({ message: validationResult.error.message });
      return;
    }

    const { email, phone, password, password_check } = req.body;

    const existingUser = await User.findOne({
      where: {
        [Op.or]: [{ email }, { phone }],
      },
    });

    if (existingUser) {
      if (existingUser.email === email)
        return res.status(409).json({ message: "Email already in use" });
      if (existingUser.phone === phone)
        return res.status(409).json({ message: "Phone number already in use" });
    }

    let avatarUrl;
    let hashPassword;

    if (password === password_check) {
      hashPassword = await bcrypt.hash(password_check, 10);
    } else {
      return res.status(500).json({ message: "Password mismatch" });
    }

    if (req.file) {
      const { path: tempUpload, originalname } = req.file;

      const result = await cloudinary.uploader.upload(tempUpload, cloudOptions);

      avatarUrl = result.url;

      fs.unlink(tempUpload, (error) => {
        if (error)
          return console.log("Error delete file from temporary folder");
      });

      console.log("Temporary file successfully deleted");
    } else {
      const localAvatarPath = path.join(
        "public",
        "avatar",
        "defaultAvatar.svg"
      );
      const result = await cloudinary.uploader.upload(
        localAvatarPath,
        cloudOptions
      );
      avatarUrl = result.url;
    }

    delete req.body.password_check;

    const addedUser = await User.create({
      ...req.body,
      password: hashPassword,
      image: avatarUrl,
    });

    res.status(201).json(addedUser);
  } catch (error) {
    if (error) {
      console.log(error);
      const err = { message: error.errors[0].message };
      res.status(500).json(err);
    }
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ where: { email } });
  if (!user) {
    return res.status(401).json({ message: "Email is invalid" });
  }

  const passwordCompare = await bcrypt.compare(password, user.password);

  if (!passwordCompare) {
    return res.status(401).json({ message: "Password is invalid" });
  }

  const payload = {
    id: user.id,
  };

  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" });

  const updateUserToken = await User.findByPk(user.id);

  if (updateUserToken) {
    await updateUserToken.update({ token });
  }

  res.json({
    message: "Login was successful",
    token,
    role: user?.role,
  });
};

const getCurrentUser = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "User is not authorized" });
  }

  const {
    id,
    name,
    last_name,
    email,
    phone,
    additional_information,
    role,
    image,
    createdAt,
  } = req.user;

  return res.json({
    id,
    name,
    last_name,
    email,
    phone,
    additional_information,
    role,
    image,
    createdAt,
  });
};

const logout = async (req, res) => {
  const { id } = req.user;

  const userById = await User.findByPk(id);

  await userById.update({ token: "" });

  res.json({
    message: "Logout Success",
  });
};

const updateUserProfile = async (req, res) => {
  const { email, phone, password } = req.body;
  const { userId } = req.params;

  try {
    const validateBody = schemas.updateSchema.validate(req.body);
    if (validateBody.error) {
      return res.status(400).json({ message: validateBody.error.message });
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (email) {
      const uniqEmail = await User.findOne({ where: { email } });
      if (uniqEmail && uniqEmail.id !== userId) {
        return res
          .status(409)
          .json({ message: `User with email ${email} already exists` });
      }
    }

    if (phone) {
      const uniqPhone = await User.findOne({ where: { phone } });
      if (uniqPhone && uniqPhone.id !== userId) {
        return res
          .status(409)
          .json({ message: `User with phone ${phone} already exists` });
      }
    }

    let updatedData = { ...req.body };
    if (password) {
      updatedData.password = await bcrypt.hash(password, 10);
    }

    if (req.file) {
      const { path: tempUpload } = req.file;

      if (user.image) {
        const publicId = user.image.split("/").pop().split(".")[0];
        if (publicId) {
          await cloudinary.uploader.destroy(publicId);
        }
      }

      const updatedImage = await cloudinary.uploader.upload(
        tempUpload,
        getCloudOptions(userId)
      );
      updatedData.image = updatedImage.url;

      fs.unlink(tempUpload, (error) => {
        if (error) console.error("Error deleting temp file:", error);
      });
    }

    await User.update(updatedData, { where: { id: userId } });

    res.status(200).json({ message: "Your info successfully updated" });
  } catch (error) {
    console.error("Error updating profile:", error);
    res
      .status(500)
      .json({ message: "An error occurred while updating your profile" });
  }
};

module.exports = {
  getAllUsers,
  register,
  login,
  updateUserProfile,
  getCurrentUser,
  logout,
};
