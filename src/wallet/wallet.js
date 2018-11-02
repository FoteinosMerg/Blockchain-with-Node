"use strict";

const sha256 = require("crypto-js/sha256");
const Signer = require("./signature-tools");
const { INITIAL_BALANCE } = require("../config");

class Wallet {
  constructor() {
    this.balance = INITIAL_BALANCE;
    this.key = Signer.genKeyPair();

    // Extract `pub` field of the above key and store its
    // hexadecimal form to be the address of the wallet
    this.publicKey = this.key.getPublic().encode("hex");
  }

  toString() {
    return `
      type      : Wallet
      balance   : ${this.balance}
      publicKey : ${this.publicKey.toString().substring(0, 64)}...`;
  }

  update(transaction, recipient, amount) {
    if (amount > this.balance) {
      // Exit with error message
      console.log(`\n * Amount ${amount} exceeds current balance`);
      return;
    } else {
      transaction.outputs.push({
        amount: amount,
        address: recipient
      });

      // Substract sent amount from sender's wallet
      this.balance = this.balance - amount;

      // Re-sign (modifies its header) and return transaction
      this.sign(transaction);
      return transaction;
    }
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

  verify(transaction) {
    return Signer.verifySignature(
      transaction.header.sender,
      transaction.header.signature,
      sha256(JSON.stringify(transaction.outputs)).toString()
    );
  }
}

module.exports = Wallet;
