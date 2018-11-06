"use strict";

const router = require("express").Router();

router.get("/", (req, res) => {
  // Will render info about blockchain (length etc.)
  res.json({ message: "Here is blockchain" });
});

router.get("/chain", (req, res) => {
  // Will render chain of blocks
});

router.get("/pending-data", (req, res) => {
  // Will render info about not confirmed data
});

router.post("/mine", (req, res) => {
  // Will perform mining
});

module.exports = router;
