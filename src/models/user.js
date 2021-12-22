const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const { verifyJwt } = require("../utils");
const { authConfigs } = require("../configs/auth");
const { SystemRole, Status, Gender } = require("../enum");
const bcrypt = require("bcryptjs");
const { ErrorCustom, ERRORS } = require("../errors");
const userSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    password: String,
    avatar: String,
    phoneNumber: String,
    idFacebook: String,
    idGoogle: String,
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
      default: SystemRole.USER,
    },
  },
  { timestamps: true }
);
userSchema.set("toJSON", {
  transform: function (doc, ret, opt) {
    try {
      delete ret["password"];
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
  verifyToken: async (token) => await verifyJwt(token, authConfigs.secret),
  verifyRefreshToken: async (refreshToken) =>
    await verifyJwt(refreshToken, authConfigs.refreshTokenSecret),
  isDeactive(user) {
    if (!user) throw new ErrorCustom(ERRORS.USER_NOT_FOUND);
    if (user.status === Status.ACTIVE)
      throw new ErrorCustom(ERRORS.ACCOUNT_HAS_BEEN_ACTIVED);
    if (user.status === Status.DELETE)
      throw new ErrorCustom(ERRORS.ACCOUNT_HAS_BEEN_DELETED);
    return true;
    //chưa active
  },
  isActive(user) {
    if (!user) throw new ErrorCustom(ERRORS.USER_NOT_FOUND);
    if (user.status === Status.DEACTIVE)
      throw new ErrorCustom(ERRORS.ACCOUNT_NOT_ACTIVED);
    if (user.status === Status.DELETE)
      throw new ErrorCustom(ERRORS.ACCOUNT_HAS_BEEN_DELETED);
    return true;
    //đã active
  },
};

userSchema.methods = {
  ...userSchema.methods,
  generateAuthToken() {
    const token = jwt.sign({ userId: this._id }, authConfigs.secret, {
      expiresIn: authConfigs.tokenLife,
    });
    const refreshToken = jwt.sign(
      { userId: this._id },
      authConfigs.refreshTokenSecret,
      {
        expiresIn: authConfigs.refreshTokenLife,
      }
    );
    return { token, refreshToken };
  },
  async comparePassword(password) {
    const isPasswordMatch = await bcrypt.compare(password, this.password);
    if (!isPasswordMatch) {
      throw new ErrorCustom(ERRORS.INCORRECT_PASSWORD);
    }
  },
};

const User = mongoose.model("User", userSchema);
module.exports = User;
