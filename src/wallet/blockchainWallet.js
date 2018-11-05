"use strict";

const Wallet = require("./wallet");
const Transaction = require("./transaction");
const { MINING_REWARD } = require("../config");

class BlockchainWallet extends Wallet {
  constructor() {
    super();
    this.address = "__blockchain_wallet__";
  }

  static reward(minerWallet) {
    /* Creates and returns a reward transaction signed by the blockchain */
    const transaction = new Transaction();
    transaction.outputs.push({
      amount: MINING_REWARD,
      address: minerWallet.publicKey
    });
    blockchainWallet.sign(transaction);
    return transaction;
  }
}
