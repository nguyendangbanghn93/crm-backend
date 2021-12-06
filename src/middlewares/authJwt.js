const jwt = require("jsonwebtoken");
const ERRORS = require("../errors");
const { MyError, errorHandler } = require("../errors/handler");
const config = require("../configs/auth");
const User = require("../models/user");
const verifyToken = (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) throw new MyErrors(ERRORS.INVALID_TOKEN);
    jwt.verify(token, config.secret, (err, decoded) => {
      if (err) throw new MyErrors(ERRORS.INVALID_TOKEN);
      req.userId = decoded.id;
      next();
    });
  } catch (error) {
    return errorHandler(res, error);
  }
};
const isAdmin = async (req, res, next) => {
  const user = await User.findOne({ _id: req.userId });
  
  User.findById(req.userId).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
    Role.find(
      {
        _id: { $in: user.roles },
      },
      (err, roles) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }
        for (let i = 0; i < roles.length; i++) {
          if (roles[i].name === "admin") {
            next();
            return;
          }
        }
        res.status(403).send({ message: "Require Admin Role!" });
        return;
      }
    );
  });
};
const isModerator = (req, res, next) => {
  User.findById(req.userId).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
    Role.find(
      {
        _id: { $in: user.roles },
      },
      (err, roles) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }
        for (let i = 0; i < roles.length; i++) {
          if (roles[i].name === "moderator") {
            next();
            return;
          }
        }
        res.status(403).send({ message: "Require Moderator Role!" });
        return;
      }
    );
  });
};
const authJwt = {
  verifyToken,
  isAdmin,
  isModerator,
};
module.exports = authJwt;
