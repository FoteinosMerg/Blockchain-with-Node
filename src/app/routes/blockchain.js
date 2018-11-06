"use strict";

const router = require("express").Router();
const { app, blockchain } = require("../..");

router.get("/", (req, res) => {
  // Will render info about blockchain (length etc.)
  res.json({ message: "Here is blockchain" });
});

router.get("/chain", (req, res) => {
  // Will render chain of blocks
  res.json(blockchain.chain);
});

router.get("/pending-data", (req, res) => {
  // Will render info about not confirmed data
  res.json(app.settings.blockchain.pendingData);
});

router.post("/mine", (req, res) => {
  // Will perform mining
});

module.exports = router;
