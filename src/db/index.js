const mongoose = require("mongoose");
const { dbConfigs } = require("../configs/db");

mongoose.Promise = global.Promise;
mongoose
  .connect(dbConfigs.mongodbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Successfully connected to the database");
  })
  .catch((err) => {
    console.log("Could not connect to the database.", err);
    process.exit();
  });
const conn = mongoose.connection;
module.exports = conn;
