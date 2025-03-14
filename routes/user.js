const express = require("express");
const router = express.Router();
const { User, validate } = require("../models/user");
const bcrypt = require("bcrypt");
const Token = require("../models/token");
const sendEmail = require("../utiles/sendEmail");
const crypto = require("crypto");

router.post("/signup", async (req, res) => {
  try {
    const { error } = validate(req.body);
    if (error) {
      return res.status(400).send({ message: error.details[0].message });
    }

    const isUserExists = await User.findOne({ email: req.body.email });
    if (isUserExists) {
      return res.status(409).send({ message: "User Already Exists" });
    }

    const salt = await bcrypt.genSalt(Number(process.env.SALT));
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const user = await new User({
      ...req.body,
      password: hashedPassword,
    }).save();

    // const token = await new Token({
    //   userId: user._id,
    //   token: crypto.randomBytes(32).toString("hex"),
    // }).save();

    // const url = `${process.env.BASE_URL}api/users/${user._id}/verify/${token.token}`;
    // await sendEmail(user.email, "Verify Email", url);

    return res.status(200).send({ message: "User Cretaed Succefully" });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Internal Server Error at signup" });
  }
});

router.get("/:id/verify/:token", async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id });
    if (!user) return res.status(400).send({ message: "Invalid link" });

    const token = await Token.findOne({
      userId: user._id,
      token: req.params.token,
    });
    if (!token) return res.status(400).send({ message: "Invalid link" });

    user.verified = true;
    await user.save();
    await token.deleteOne();

    res.status(200).send({ message: "Email verified successfully" });
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
});

module.exports = router;
