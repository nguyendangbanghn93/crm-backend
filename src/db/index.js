// Configuring the database
const mongoose = require("mongoose");
const { dbConfigs } = require("../configs/db");
const Role = require("../models/role");

mongoose.Promise = global.Promise;
// Connecting to the database
mongoose
  .connect(dbConfigs.mongodbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Successfully connected to the database");
    initial();
  })
  .catch((err) => {
    console.log("Could not connect to the database.", err);
    process.exit();
  });
const conn = mongoose.connection;
function initial() {
  Role.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {
      new Role({
        name: "user",
      }).save((err) => {
        if (err) {
          console.log("error", err);
        }
        console.log("added 'user' to roles collection");
      });
      new Role({
        name: "moderator",
      }).save((err) => {
        if (err) {
          console.log("error", err);
        }
        console.log("added 'moderator' to roles collection");
      });
      new Role({
        name: "admin",
      }).save((err) => {
        if (err) {
          console.log("error", err);
        }
        console.log("added 'admin' to roles collection");
      });
    }
  });
}
module.exports = conn;
