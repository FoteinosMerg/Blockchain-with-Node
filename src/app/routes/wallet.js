"use strict";

const router = require("express").Router();
const { app, blockchain, wallet } = require("../..");

router.get("/", (req, res) => {
  // Will render info about user's wallet (balance and public key)
  res.json({ message: "Here is wallet" });
});

router.get("/public-key", (req, res) => {
  // Will render user's public key
  res.json({ publicKey: wallet.publicKey });
});

router.get("/current-balance", (req, res) => {
  // Will render balance after recalculation
  res.json({ currentBalance: wallet.balance });
});

router.get("/pending-transactions", (req, res) => {
  // Will render current transaction
  //res.json({ pendingTransactions: wallet.pendingTransactions(blockchain) });
  res.json();
});

router.get("/transact", (req, res) => {
  // Will render transaction form
});

router.post("/transact", (req, res) => {
  // Will perform transaction
});

module.exports = router;
