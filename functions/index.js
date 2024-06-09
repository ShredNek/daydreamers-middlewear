/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

// const {onRequest} = require("firebase-functions/v2/https");
// const logger = require("firebase-functions/logger");

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import functions from "firebase-functions";
import controllers from "./script/controllers.js";

const port = 3000;

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.get("/", (req, res) => res.send("All good to go"));
app.post("/", (req, res) => controllers.handleGqlPost(req, res));
app.post("/enquiry", (req, res) => controllers.postEnquiry(req, res));

export const api = functions.https.onRequest(app);
