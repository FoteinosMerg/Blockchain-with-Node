"use strict";

const Signer = require("./signature-tools");
const { INITIAL_BALANCE } = require("../config");

class TransactionPool {
  constructor() {
    this.transactions = [];
  }

  toString() {
    let poolString = "empty";

    if (this.transactions.length > 0) {
      poolString = "";
      this.transactions.forEach(transaction => {
        poolString += transaction.toString();
      });
    }
    return poolString;
  }

  findBySender(publicKey) {
    return this.transactions.find(t => t.cache.sender === publicKey);
  }

  update(transaction) {
    /*
    Updates the pool either by pushing to it a new transaction or by
    updating an already existing transaction (identified by its id)
    */

    const found = this.transactions.find(t => t.id === transaction.id);

    if (found) {
      const index = this.transactions.indexOf(found);
      this.transactions[index] = transaction;
    } else {
      this.transactions.push(transaction);
    }
  }

  validTransactions() {
    return this.transactions.filter(transaction => {
      // Calculate sum of outcoming payments
      const totalOutput = transaction.outputs.reduce((total, current) => {
        return total + current.amount;
      }, 0);

      // Check balance
      if (totalOutput + transaction.cache.balance !== INITIAL_BALANCE) {
        console.log(
          `\n * Invalid transaction performed by ${transaction.header.sender}`
        );
        return;
      }

      // Verify signature
      if (!Signer.verify(transaction)) {
        console.log(`Invalid signature from ${transaction.header.sender}`);
        return;
      }

      return transaction;
    });
  }

  clear() {
    this.transactions = [];
  }
}

module.exports = TransactionPool;
