const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
var corsOptions = {
  origin: "http://localhost:8081",
};
const dotenv = require("dotenv");
const dotenvExpand = require("dotenv-expand");
const myEnv = dotenv.config();
dotenvExpand(myEnv);
app.use(cors(corsOptions));
// parse requests of content-type - application/json
// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

require("./src/db");
require("./src/Utils/passport");
const routes = require("./src/routes");
app.use("/v1/api", routes);
app.get("/v1/api", (req, res) => {
  res.json({ message: "Welcome crm app" });
});

app.set("views", "./src/views");
app.set("view engine", "ejs");
app.get("/views", function (req, res) {
  res.render("index", { user: req.user });
});
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
