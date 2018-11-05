"use strict";

const uuid1 = require("uuid/v1"); // timestamp based version
const { MINING_REWARD } = require("../config");

class Transaction {
  constructor() {
    this.id = uuid1();
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

  static reward(blockchainWallet, minerWallet) {
    /* Creates and returns a reward transaction signed by the blockchain */
    const transaction = new this();
    transaction.outputs.push({
      amount: MINING_REWARD,
      address: minerWallet.publicKey
    });
    blockchainWallet.sign(transaction);
    return transaction;
  }
}

module.exports = Transaction;
