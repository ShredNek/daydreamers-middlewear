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
import cors from "cors";
import functions from "firebase-functions";
import controllers from "./script/controllers.js";

// require("dotenv").config();

const app = express();
app.use(cors());

// app.use(express.json());
// app.use(express.static("public"));

app.get("/", (req, res) => res.send("All good to go"));

app.post("/", (req, res) => controllers.handleGqlPost(req, res));

export const api = functions.https.onRequest(app);
