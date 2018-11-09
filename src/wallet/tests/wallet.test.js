"use strict";

const sha256 = require("crypto-js/sha256");

const Transaction = require("../transaction");
const Wallet = require("../wallet");
const TransactionPool = require("../transaction-pool");

describe("Tests sign function", () => {
  const transaction = new Transaction();
  const wallet = new Wallet();
  wallet.sign(transaction); // no outputs at signing moment
  it("tests transaction signature", () => {
    expect(transaction.header.signature).toEqual(
      wallet.key.sign(sha256(JSON.stringify([])).toString())
    );
  });
});

const transactionPool = new TransactionPool();

describe("Tests performing transactions function", () => {
  it("tests failure in case amount exceeds cached balance", () => {});
});
