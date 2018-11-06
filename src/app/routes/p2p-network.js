"use strict";

const router = require("express").Router();
const { app, transactionPool } = require("../..");

router.get("/", (req, res) => {
  // Will render info about network
  res.json({ message: "Here is network" });
});

router.get("/peers", (req, res) => {
  // Will render info about peers
});

router.get("/transaction-pool", (req, res) => {
  // Will render info about current transaction pool
  res.json(transactionPool);
});

module.exports = router;
