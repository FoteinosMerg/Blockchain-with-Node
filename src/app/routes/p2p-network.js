"use strict";

const router = require("express").Router();

router.get("/", (req, res) => {
  // Will display info about network
  res.json({ message: "Here is network" });
});

router.get("/peers", (req, res) => {
  // Will display info about peers
});

module.exports = router;
