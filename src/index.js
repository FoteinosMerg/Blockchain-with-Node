/*
This file serves as the entry point to the application
*/

"use strict";

// In production, read environmental variables from ../.env
if (process.env.NODE_ENV === "production") require("dotenv").config();

const { HTTP_PORT } = require("./config");

const createApp = function() {
  // Load pacakges
  const express = require("express");
  const bodyParser = require("body-parser");

  // Load files
  const Blockchain = require("./blockchain");
  const { P2PServer, Miner } = require("./p2p-network");
  const { Wallet, TransactionPool } = require("./wallet");

  // Initialize objects
  const blockchain = new Blockchain();
  const wallet = new Wallet();
  const transactionPool = new TransactionPool();
  const p2pServer = new P2PServer(blockchain, transactionPool);
  const miner = new Miner(blockchain, wallet, transactionPool, p2pServer);

  // Attach objects to app
  const app = express();
  app.set("blockchain", blockchain);
  app.set("wallet", wallet);
  app.set("transactionPool", transactionPool);
  app.set("p2pServer", p2pServer);
  app.set("miner", miner);

  // Parsing middlewares
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));

  return app;
};

// Initialize and export before applying routing middlewares
const app = createApp();
module.exports = {
  app,
  blockchain: app.settings.blockchain,
  wallet: app.settings.wallet,
  transactionPool: app.settings.transactionPool,
  p2pServer: app.settings.p2pServer
};

// Routing middlewares
app.get("/", (req, res) => res.redirect("/api"));
app.use("/api", require("./app/index"));

// Maintain here some routing for easy testing

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
    blockchain,
    transactionPool
  );
  p2pServer.broadcastTransaction(transaction);
  res.redirect("./transactions");
});

app.get("/pendingData", (req, res) => {
  res.json(app.settings.blockchain.pendingData);
});

app.post("/pendingData/new", (req, res) => {
  const index = app.settings.blockchain.storeTransactions(req.body.data);
  res.redirect("/pendingData");
});

app.get("/mine", (req, res) => {
  const block = miner.mine();
  console.log(`\n * New block mined: ${block}`);
  res.redirect("/chain");
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
  app.settings.p2pServer.listen(); // Bind ws-server to P2P_PORT (default: 8080) for p2p-communication
});
