"use strict";

// In production, read environmental variables from ../.env
if (process.env.NODE_ENV === "production") require("dotenv").config();

const opn = require("opn");
const { ADDRESS, HTTP_PORT } = require("./config");

const createApp = function() {
  // Load pacakges
  const express = require("express");
  const bodyParser = require("body-parser");
  const path = require("path");

  // Load object files
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

  // View engine configuration
  app.set("view engine", "pug");
  app.set("views", path.join(__dirname + "/app", "views/templates"));

  // Remove info about framework type
  app.disable("x-powered-by");

  // Parsing middlewares
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));

  return app;
};

// Initialize and export before applying routing middlewares
// so that objects attached to app be accessible at routing
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

// ------------------ Maintain here some routing for easy testing

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
  app.settings.blockchain.storeData(req.body.data);
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

// -------------------------------------------------------------------

// Bind client at HTTP_PORT (default: 5000) for front- to back-end communication
app.listen(HTTP_PORT, ADDRESS, () => {
  // Launch app with default browser
  opn(`http://localhost:${HTTP_PORT}`);
  console.log(
    `\n * Application server bound to http://${ADDRESS}:${HTTP_PORT}`
  );
  // Bind ws-server at P2P_PORT (default: 8080) for communication between peers
  app.settings.p2pServer.listen();
});
