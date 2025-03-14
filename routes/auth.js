const express = require("express");
const router = express.Router();
const { User } = require("../models/user");
const bcrypt = require("bcrypt");
const Joi = require("joi");
const passwordComplexity = require("joi-password-complexity");
const Token = require("../models/token");
const sendEmail = require("../utiles/sendEmail");
const crypto = require("crypto");
const createOtp = require("../healpers/otpGeneration");
const OtpModel = require("../models/otpModel");

const validateEmail = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().required().label("Email"),
  });
  return schema.validate(data);
};

const validateLogin = (data) => {
  try {
    const schema = Joi.object({
      email: Joi.string().required().label("Email"),
      password: passwordComplexity().required().label("Password"),
    });
    return schema.validate(data);
  } catch (error) {
    throw error;
  }
};

const validateOtp = (data) => {
  try {
    const schema = Joi.object({
      email: Joi.string().email().required().label("Email"),
      otp: Joi.string().length(6).required().label("OTP"), // assuming a 6-digit OTP
    });
    return schema.validate(data);
  } catch (error) {
    throw error;
  }
};

router.post("/login", async (req, res) => {
  try {
    const { error } = validateLogin(req.body);
    if (error) {
      return res.status(400).send({ message: error.details[0].message });
    }
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(409).send({ meesage: "invalid email or password" });
    }
    const validatePassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!validatePassword) {
      return res.status(409).send({ meesage: "invalid email or password" });
    }
    await createOtp(req.body.email);
    const token = user.generateAuthToken();
    res.status(200).send({ data: token, message: "logged in successfully" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ meesage: "Internal Server Error At login Route" });
  }
});

router.post("/verify/otp", async (req, res) => {
  try {
    const data = {
      email: req.body.email,
      otp: req.body.otp,
    };

    // Validate input data
    const { error } = validateOtp(data);
    if (error) {
      return res.status(400).send({ message: error.details[0].message });
    }

    // Find the OTP in the database
    const getOtp = await OtpModel.findOne({ email: req.body.email });

    if (!getOtp) {
      return res.status(400).send({ message: "OTP not found or expired" });
    }

    // Check if OTP matches
    if (parseInt(getOtp.otp) !== parseInt(req.body.otp)) {
      return res.status(400).send({ message: "Mismatched OTP" });
    }

    // OTP matches, proceed with login or next step
    res.status(200).send({ message: "Logged in successfully" });

    // Optionally, delete the OTP after successful verification
    await OtpModel.deleteOne({ email: req.body.email, otp: req.body.otp });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .send({ message: "Internal Server Error At login Route" });
  }
});

router.post("/resend/otp", async (req, res) => {
  try {
    const { error } = validateEmail({ email: req.body.email });
    if (error) {
      return res.status(400).send({ message: error.details[0].message });
    }

    await createOtp(req.body.email);
    res.status(200).send({ message: "Resent OTP successfully" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .send({ message: "Internal Server Error at Resend OTP Route" });
  }
});

module.exports = router;
