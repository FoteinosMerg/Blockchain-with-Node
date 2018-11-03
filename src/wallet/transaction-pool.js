"use strict";

class TransactionPool {
  constructor() {
    this.transactions = [];
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

  findBySender(address) {
    return this.transactions.find(t => t.header.sender === address);
  }
}

module.exports = TransactionPool;
