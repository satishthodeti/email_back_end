const { required } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const tokenSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "userDb",
      // unique: true,
    },
    token: { type: String, required: true },
    createdAt: { type: Date, default: Date.now(), expires: 3600 }, //1 hour
  },
  { timestamps: true }
);

module.exports = mongoose.model("token", tokenSchema);
