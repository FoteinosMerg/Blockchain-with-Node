"use strict";

const uuid = require("uuid/v1"); // timestamp based version

class Transaction {
  constructor() {
    this.id = uuid();
    this.header = null;
    this.outputs = [];
  }

  toString() {}

  /*
  Keeps actual creation of a transaction separate from the constructor method due to
  error message (returns undefined) in case of amount exceeding the sender's balance
  */
  static new(senderWallet, recipient, amount) {
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

      // Substract sent amount from sender's wallet
      senderWallet.balance = senderWallet.balance - amount;

      // Sign (modifies its header) and return transaction
      senderWallet.sign(transaction);
      return transaction;
    }
  }
}

module.exports = Transaction;
