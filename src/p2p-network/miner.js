"use strict";

const { Wallet, Transaction } = require("../wallet");

class Miner {
  constructor(blockchain, wallet, transactionPool, p2pServer) {
    this.blockchain = blockchain;
    this.wallet = wallet;
    this.transactionPool = transactionPool;
    this.p2pServer = p2pServer;
  }

  mine() {
    // Collect valid transactions from pool
    const validTransactions = this.transactionPool.validTransactions();

    // Include reward for the miner
    validTransactions.push(
      Transaction.reward(Wallet.blockchainWallet(), this.wallet)
    );

    // Mine block storing valid transactions
    this.blockchain.pendingData.push(validTransactions);
    const block = this.blockchain.createBlock();

    // Synchronize chains among peers
    this.p2pServer.synchronizeChains();

    // Clear own transaction pool
    this.transactionPool.clear();

    // Broadcast signal for clearing transaction pools
    this.p2pServer.broadcastTransactionPoolClearance();

    // Return mined block
    return block;
  }
}

module.exports = Miner;
