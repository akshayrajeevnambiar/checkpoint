require("dotenv").config();
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const userModel = require("../models/User");
const { SALT_ROUNDS, TOKEN_EXPIRY } = require("../config/constants");

const signUpValidator = [
  body("username", "Username is required").notEmpty(),
  body("password", "Password should be a minimum of 6 characters long")
    .notEmpty()
    .isLength({ min: 6 }),
  body("email").notEmpty().isEmail(),
];

// creating a @POST route for user registeration
router.post("/register", signUpValidator, async (req, res) => {
  const signupErrors = validationResult(req);

  if (!signupErrors.isEmpty()) {
    res.status(422).json({
      errors: signupErrors.array(),
    });
  }

  // db operations wherein we add the user to the database
  try {
    const { username, password, email } = req.body;

    // check whether the user is already registered
    let user = await userModel.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: "User already exists" });
    }

    // We would be hashing the password for an added layer of security
    // we first define the of salt rounds
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    const hashedPassword = await bcrypt.hash(password, salt);

    // defing the new user object
    user = new userModel({
      username: username,
      password: hashedPassword,
      email: email,
    });

    // waiting for user creation
    await user.save();

    // JWT for faster authentication
    const payload = {
      user: {
        id: user.id,
      },
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
      expiresIn: TOKEN_EXPIRY,
    });

    res.status(200).json({
      token: token,
      success: "new user has been registered",
    });
  } catch (err) {
    res.status(402).json({
      error: err.message,
    });
  }
});

module.exports = router;
