const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const passwordComplexity = require("joi-password-complexity");
const token = require("../models/token");
const sendMail = require("../utiles/sendEmail");

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String },
    lastName: { type: String },
    email: { type: String },
    password: { type: String },
    isDelete: { type: Boolean, default: false },
    verifyToken: { type: Boolean, default: false },
  },
  { timestamps: true }
);

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id }, process.env.JWT_MY_PERSONAL_TOKEN, {
    expiresIn: "1d",
  });
  return token;
};

const validate = (data) => {
  try {
    const schema = Joi.object({
      firstName: Joi.string().required().label("First Name"),
      lastName: Joi.string().required().label("Last Name"),
      email: Joi.string().required().label("Email"),
      password: passwordComplexity().required().label("Password"),
    });
    return schema.validate(data);
  } catch (error) {
    throw error;
  }
};

const User = mongoose.model("user", userSchema);

module.exports = { User, validate };
