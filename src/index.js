"use strict";

// In production, read environmental variables from ../.env
if (process.env.NODE_ENV === "production") require("dotenv").config();

// Load pacakges
const express = require("express");
const bodyParser = require("body-parser");

// Load files
const Blockchain = require("./blockchain");
const { P2PServer } = require("./p2p-network");
const { Wallet, TransactionPool } = require("./wallet");
const { HTTP_PORT } = require("./config");

// Initialize app and p2p (web-socket) server
const app = express();
const wallet = new Wallet();
const transactionPool = new TransactionPool();
const blockchain = new Blockchain();
const p2pServer = new P2PServer(blockchain, transactionPool);

// Apply middlewares
app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({ extended: false }));

// Routing
app.get("/chain", (req, res) => {
  res.json(blockchain.chain);
});

app.get("/transactions", (req, res) => {
  res.json(transactionPool.transactions);
});

app.post("/transact", (req, res) => {
  const { recipient, amount } = req.body;
  const transaction = wallet.performTransaction(
    recipient,
    amount,
    transactionPool
  );
  p2pServer.broadcastTransaction(transaction);
  res.redirect("./transactions");
});

app.get("/pendingData", (req, res) => {
  res.json(blockchain.pendingData);
});

app.get("/public-key", (req, res) => {
  res.json({ publicKey: wallet.publicKey });
});

app.post("/pendingData/new", (req, res) => {
  const index = blockchain.storeTransactions(req.body.data);
  res.redirect("/pendingData");
});

app.post("/mine", (req, res) => {
  const block = blockchain.createBlock();
  console.log(`\n * New block created:\n ${block}`);

  p2pServer.synchronizeChains();

  res.redirect("/chain");
});

// Bind to HTTP port (default: 5000) for front- to back-end communication
app.listen(HTTP_PORT, () => {
  console.log(`\n * Server bound to port ${HTTP_PORT}`);
  // Bind ws-server to P2P_PORT (default: 8080) for peer to peer communication
  p2pServer.listen();
});
