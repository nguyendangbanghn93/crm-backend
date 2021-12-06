const mongoose = require("mongoose");
const ERRORS = require("../errors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { verifyJwt } = require("../utils");
const { authConfigs } = require("../configs/auth");
const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  roles: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role",
    },
  ],
});

userSchema.statics = {
  ...userSchema.statics,
  verifyToken: async (token) => verifyJwt(token, authConfigs.secret),
  verifyRefreshToken: async (refreshToken) =>
    verifyJwt(refreshToken, authConfigs.refreshTokenSecret),
};
userSchema.methods = {
  ...userSchema.methods,
  generateAuthToken: () => {
    const token = jwt.sign({ userId: this._id }, authConfig.secret, {
      expiresIn: authConfig.tokenLife,
    });
    const refreshToken = jwt.sign(
      { userId: this._id },
      authConfig.refreshTokenSecret,
      {
        expiresIn: authConfig.refreshTokenLife,
      }
    );
    return { token, refreshToken };
  },
};

const User = mongoose.model("User", userSchema);
module.exports = User;
