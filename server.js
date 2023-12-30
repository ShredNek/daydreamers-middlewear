const express = require("express");
const cors = require("cors");
require("dotenv").config();

const controllers = require("./controllers.js");

const app = express();
app.use(cors());

const PORT = process.env.PORT || 3001;

app.use(express.json());

app.post("/api/all", (req, res) => controllers.getAllItems(req, res));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
