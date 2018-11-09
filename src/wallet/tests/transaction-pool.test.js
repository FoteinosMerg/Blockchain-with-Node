"use strict";

const sha256 = require("crypto-js/sha256");

const TransactionPool = require("../transaction-pool");
const Transaction = require("../transaction");
const Wallet = require("../wallet");
const Signer = require("../signature-tools");

const INITIAL_BALANCE = 500; // Manually set here for testing

// Create sender wallets
const senderWallet1 = new Wallet();
const senderWallet2 = new Wallet();
const senderWallet3 = new Wallet();
const senderWallet4 = new Wallet();
const senderWallet5 = new Wallet();

// Create one transaction signed by each wallet and update with second payment

const transaction1 = Transaction.new(senderWallet1, "recipient10", 100);
transaction1.update(senderWallet1, "recipient11", 50);
// cached balance: 350

const transaction2 = Transaction.new(senderWallet2, "recipient20", 200);
transaction2.update(senderWallet2, "recipient21", 10);
// cached balance: 290

const transaction3 = Transaction.new(senderWallet3, "recipient30", 120);
transaction3.update(senderWallet3, "recipient31", 70);
// cached balance: 310

const transaction4 = Transaction.new(senderWallet4, "recipient40", 170);
transaction4.update(senderWallet4, "recipient41", 60);
// cached balance: 270

const transaction5 = Transaction.new(senderWallet5, "recipient50", 340);
transaction5.update(senderWallet5, "recipient51", 90);
// cached balance: 70

const transactions = [
  transaction1,
  transaction2,
  transaction3,
  transaction4,
  transaction5
];

// Pool creation
const transactionPool = new TransactionPool();

describe("Tests pool updating with brand new transactions", () => {
  // Update successively
  transactions.forEach(transaction => transactionPool.update(transaction));

  it("tests transaction list after finishing updating", () => {
    expect(transactionPool.transactions).toEqual(transactions);
  });
});

describe("Tests pool updating with already existing transactions", () => {
  // Update second and fifth transaction as valid

  transaction2.update(senderWallet2, "recipient22", 20);
  transaction2.update(senderWallet2, "recipient23", 15);
  // cached balance: 255

  transaction5.update(senderWallet5, "recipient52", 32);
  transaction5.update(senderWallet5, "recipient53", 24);
  // cached balance: 14

  // Update pool
  transactionPool.update(transaction2);
  transactionPool.update(transaction5);

  it("tests transaction list after finishing updating", () => {
    expect(transactionPool.transactions).toEqual(transactions);
  });
});

describe("Tests valid transactions selector", () => {
  // Update first, second and fifth transaction as valid
  transaction1.update(senderWallet1, "recipient14", 12);
  transaction2.update(senderWallet2, "recipient24", 9);
  transaction5.update(senderWallet5, "recipient54", 4);

  // "Update" third transaction as invalid: pay without re-caching balance
  transaction3.outputs.push({ recipient: "recipient34", amount: 100 });

  // "Update" fourth transaction as invalid: pay normally but tamper signature
  transaction4.update(senderWallet4, "recipient44", 60);
  const key = Signer.genKeyPair();
  transaction4.header.signature = key.sign(
    sha256(JSON.stringify(transaction4.outputs)).toString()
  );

  // Update pool
  transactions.forEach(transaction => transactionPool.update(transaction));

  it("tests valid transactions output", () => {
    expect(transactionPool.validTransactions()).toEqual([
      transaction1,
      transaction2,
      transaction5
    ]);
  });
});
