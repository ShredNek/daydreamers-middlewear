const express = require("express");
const cors = require("cors");
require("dotenv").config();

const controllers = require("./controllers.js");

const app = express();
app.use(cors());
const PORT = process.env.PORT || 3001;

app.use(express.json());

// Define a route for proxying Shopify requests
app.post("/api/all", (req, res) => controllers.getAllItems(req, res));

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
