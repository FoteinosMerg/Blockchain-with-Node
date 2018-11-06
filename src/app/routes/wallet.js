"use strict";

const router = require("express").Router();

router.get("/", (req, res) => {
  // Will render info about user's wallet (balance and public key)
  res.json({ message: "Here is wallet" });
});

router.get("/public-key", (req, res) => {
  // Will render user's public key
});

router.get("/current-balance", (req, res) => {
  // Will render balance after recalculation
});

router.get("/current-transaction", (req, res) => {
  // Will render current transaction
});

router.get("/transact", (req, res) => {
  // Will render transaction form
});

router.post("/transact", (req, res) => {
  // Will perform transaction
});

module.exports = router;
