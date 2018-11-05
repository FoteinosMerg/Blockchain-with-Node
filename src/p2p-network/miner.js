"use strict";

const { BlockchainWallet } = require("../wallet");

class Miner {
  constructor(blockchain, transactionPool, wallet, p2pServer) {
    this.blockchain = blockchain;
    this.transactionPool = transactionPool;
    this.wallet = wallet;
    this.p2pServer = p2pServer;
  }

  mine() {
    // Collect valid transactions from pool
    const validTransactions = this.transactionPool.validTransaction();
    // Include reward for the miner
    validTransactions.push(BlockchainWallet.reward(this.wallet));
    // Mine block storing valid transactions
    this.blockchain.pendingData.push(validTransactions);
    const block = this.blockchain.createBlock();
    // Synchronize chains among peers
    this.p2pServer.synchronizeChains();
    // Clear transaction pool
    this.transactionPool.clear();
    // Broadcast
  }
}

module.exports = Miner;
