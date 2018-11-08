"use strict";

const uuid1 = require("uuid/v1"); // timestamp based version
const { MINING_REWARD } = require("../config");

class Transaction {
  constructor() {
    this.id = uuid1();

    // Will contain signature info, to be modified by wallet during signing
    this.header = null;

    // Will contain sender info, to be modified during actual construction
    this.cache = null;

    // Will contain unconfirmed (pending) payments performed by the sender
    this.outputs = [];
  }

  toString() {
    let transactionString = `\n
      T R A N S A C T I O N
      ---------------------

      id        : ${this.id}

      timestamp : ${this.header.timestamp}
      signature : ${this.header.signature.r}
                  ${this.header.signature.s}

      sender    : ${this.cache.sender.substring(0, 64)}...
      balance   : ${this.cache.balance}`;

    this.outputs.forEach(output => {
      transactionString += `\n
      recipient : ${output.recipient.substring(0, 64)}
      amount    : ${output.amount}`;
    });

    return transactionString;
  }

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
      transaction.cache = {
        sender: senderWallet.publicKey,
        balance: senderWallet.balance - amount
      };
      transaction.outputs.push({
        recipient: recipient,
        amount: amount
      });

      // Sign (modifies its header) and return transaction
      senderWallet.sign(transaction);
      return transaction;
    }
  }

  update(senderWallet, recipient, amount) {
    if (amount > this.cache.balance) {
      console.log(`\n * Amount ${amount} exceeds current balance`);
      return;
    } else {
      this.outputs.push({
        recipient: recipient,
        amount: amount
      });

      // Substract sent amount from cache
      this.cache.balance -= amount;

      // Re-sign transaction (modifies header and cache)
      senderWallet.sign(this);

      return this;
    }
  }

  static reward(blockchainWallet, minerWallet) {
    /* Creates and returns a reward transaction signed by the blockchain */
    return Transaction.new(
      blockchainWallet,
      minerWallet.publicKey,
      MINING_REWARD
    );
  }
}

module.exports = Transaction;
