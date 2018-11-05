"use strict";

const Signer = require("./signature-tools");

class TransactionPool {
  constructor() {
    this.transactions = [];
  }

  findBySender(address) {
    return this.transactions.find(t => t.header.sender === address);
  }

  update(transaction) {
    /*
    Updates the pool either by pushing to it a new transaction or by updating
    an already existing transaction (identified by the arguments id)
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
      // Check balance
      const totalOutput = transaction.outputs.reduce((total, current) => {
        return total + current.amount;
      }, 0);
      if (totalOutput !== transaction.header.balance) {
        console.log(
          `\n * Invalid transaction performed by ${transaction.header.sender}`
        );
        return;
      }

      // Verify signature
      if (!Signer.verifyTransaction(transaction)) {
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
