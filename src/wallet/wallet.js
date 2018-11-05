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

  static blockchainWallet() {
    const blockchainWallet = new this();
    blockchainWallet.address = "__blockchain_wallet__";
    return blockchainWallet;
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

  performTransaction(recipient, amount, blockchain, transactionPool) {
    // Update this wallet's balance in accordance with
    // transactions stored in the inserted blockchain
    this.recalculateBalance(blockchain);

    if (amount > this.balance) {
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

  recalculateBalance(blockchain) {
    let balance = this.balance;

    // Collect all transactions stored in the blockchain
    let transactions = [];
    blockchain.chain.forEach(block =>
      block.data.forEach(transaction => {
        transactions.push(transaction);
      })
    );

    // Filter out transactions performed by this wallet
    const ownTransactions = transactions.filter(
      transaction => transaction.header.sender === this.publicKey
    );

    // Will be modified to store the moment that the most recent
    // transaction performed by this wallet (if any) took place
    let mostRecentTimestamp = 0;

    // Detect the most recent of the transactions performed by this wallet;
    // (ensure to avoid reducing (`undefined`) in case of an empty array)
    if (ownTransactions.length > 0) {
      const mostRecent = ownTransactions.reduce(
        (previous, current) =>
          previous.header.timestamp > current.header.timestamp
            ? previous
            : current
      );

      // Store the moment that the most recent transaction
      // performed by this wallet took place
      mostRecentTimestamp = mostRecent.header.timestamp;

      // Store this wallet's cached balance at the moment, when the
      // most recent transaction performed by this wallet took place
      balance = mostRecent.outputs[0].amount;
    }

    // Take into account incoming payments that took place after the moment,
    // when the most recent transaction performed by this wallet took place
    transactions.forEach(transaction => {
      if (transaction.header.timestamp > mostRecentTimestamp) {
        transaction.outputs.find(output => {
          if (output.address === this.publicKey) {
            balance += output.amount;
          }
        });
      }
    });

    // Update this wallet's balance
    this.balance = balance;
  }
}
module.exports = Wallet;
