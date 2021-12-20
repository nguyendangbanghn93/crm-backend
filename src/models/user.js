const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const { verifyJwt } = require("../utils");
const { authConfigs } = require("../configs/auth");
const { SystemRole, Status, Gender } = require("../enum");
const bcrypt = require("bcryptjs");
const userSchema = new mongoose.Schema(
  {
    username: String,
    email: String,
    password: String,
    avatar: String,
    phoneNumber: String,
    activeToken: String,
    gender: {
      type: String,
      enum: Object.values(Gender),
    },
    status: {
      type: Number,
      enum: Object.values(Status),
      default: Status.DEACTIVE,
    },
    role: {
      type: Number,
      enum: Object.values(SystemRole),
    },
  },
  { timestamps: true }
);
userSchema.set("toJSON", {
  transform: function (doc, ret, opt) {
    try {
      delete ret["password"];
      delete ret["tokens"];
      delete ret["activeToken"];
    } catch (e) {}
    return ret;
  },
});
userSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, authConfigs.salt);
  }
  next();
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
