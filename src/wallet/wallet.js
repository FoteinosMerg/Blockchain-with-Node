"use strict";

const sha256 = require("crypto-js/sha256");
const Signer = require("./signature-tools");
const Transaction = require("./transaction");
const { INITIAL_BALANCE } = require("../config");

class Wallet {
  constructor() {
    this.balance = INITIAL_BALANCE;
    this.key = Signer.genKeyPair();
    this.publicKey = this.key.getPublic().encode("hex");
  }

  toString() {
    return `
      type      : Wallet
      balance   : ${this.balance}
      publicKey : ${this.publicKey.toString().substring(0, 64)}...`;
  }

  sign(transaction) {
    transaction.header = {
      timestamp: Date.now(),
      balance: this.balance,
      sender: this.publicKey,
      signature: this.key.sign(
        sha256(JSON.stringify(transaction.outputs)).toString()
      )
    };
  }

  performTransaction(recipient, amount, transactionPool) {
    if (amount > this.balance) {
      // Exit with error message
      console.log(`\n * Amount ${amount} exceeds current balance`);
      return;
    } else {
      let transaction = transactionPool.findBySender(this.publicKey);
      if (transaction) {
        transaction.update(this, recipient, amount);
      } else {
        transaction = Transaction.new(this, recipient, amount);
        transactionPool.update(transaction);
      }
      return transaction;
    }
  }

  static blockchainWallet() {
    const blockchainWallet = new this();
    blockchainWallet.address = "__blockchain_wallet__";
    return blockchainWallet;
  }
}
module.exports = Wallet;
