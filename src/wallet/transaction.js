"use strict";

const uuid = require("uuid/v1"); // timestamp based version

class Transaction {
  constructor() {
    this.id = uuid();
    this.header = null;
    this.outputs = [];
  }

  toString() {}

  static new(senderWallet, recipient, amount) {
    /*
    Keeps actual creation of a transaction separate from the constructor method due to
    error message (returns undefined) in case of amount exceeding the sender's balance
    */

    if (amount > senderWallet.balance) {
      // Exit with error message
      console.log(`\n * Amount ${amount} exceeds current balance`);
      return;
    } else {
      const transaction = new this();
      transaction.outputs.push(
        ...[
          {
            amount: senderWallet.balance - amount,
            address: senderWallet.publicKey
          },
          {
            amount: amount,
            address: recipient
          }
        ]
      );

      // Sign (modifies its header) and return transaction
      senderWallet.sign(transaction);
      return transaction;
    }
  }

  update(senderWallet, recipient, amount) {
    if (amount > this.outputs[0].amount) {
      // Exit with error message
      console.log(`\n * Amount ${amount} exceeds current balance`);
      return;
    } else {
      this.outputs.push({
        amount: amount,
        address: recipient
      });

      // Substract sent amount from the sender's cache
      this.outputs[0].amount -= amount;

      // Re-sign (modifies its header) and return transaction
      senderWallet.sign(this);
      return this;
    }
  }
}

module.exports = Transaction;
