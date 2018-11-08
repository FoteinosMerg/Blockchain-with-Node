"use strict";

const sha256 = require("crypto-js/sha256");
const Transaction = require("../transaction");
const Wallet = require("../wallet");
const { INITIAL_BALANCE, MINING_REWARD } = require("../../config");

describe("Tests transaction structure before first actual signing", () => {
  let transaction;
  beforeEach(() => {
    transaction = new Transaction();
  });

  it("tests non-empty id", () => {
    expect(transaction.id.length != 36).toEqual(false);
  });
  it("tests empty header", () => {
    expect(transaction.header == null).toEqual(true);
  });
  it("tests empty cache", () => {
    expect(transaction.cache == null).toEqual(true);
  });
  it("tests empty outputs", () => {
    expect(transaction.outputs.length == 0).toEqual(true);
  });

  describe("Tests transaction structure after first actual signing", () => {
    let senderWallet, recipient, amount, transaction;
    beforeEach(() => {
      senderWallet = new Wallet();

      // Generate some random string as recipient
      recipient = Math.random()
        .toString(36)
        .substring(2, 15);

      // Generate some random amount wich does not exceed initial balance
      amount = Math.floor(Math.random() * (INITIAL_BALANCE + 1));

      // Create transaction according to above parameters
      transaction = Transaction.new(senderWallet, recipient, amount);
    });

    it("tests failure in case of amount exceeding balance", () => {
      expect(
        Transaction.new(senderWallet, recipient, INITIAL_BALANCE + 1)
      ).toEqual(undefined);
    });

    it("tests signature", () => {
      expect(transaction.header.signature).toEqual(
        senderWallet.key.sign(
          sha256(JSON.stringify(transaction.outputs)).toString()
        )
      );
    });

    it("tests sender", () => {
      expect(transaction.cache.sender).toEqual(senderWallet.publicKey);
    });

    it("tests sender's cached balance", () => {
      expect(transaction.cache.balance).toEqual(INITIAL_BALANCE - amount);
    });
  });

  describe("Tests transaction updating", () => {
    const senderWallet = new Wallet();
    const transaction = Transaction.new(
      senderWallet,
      Math.random()
        .toString(36)
        .substring(2, 15),
      Math.floor(Math.random() * INITIAL_BALANCE)
    );
    const recipient = Math.random()
      .toString(36)
      .substring(2, 15);

    it("tests failure in case of amount exceeding cached balance", () => {
      const wrongAmount = transaction.cache.balance + 1;
      expect(transaction.update(senderWallet, recipient, wrongAmount)).toEqual(
        undefined
      );
    });

    it("tests signature", () => {
      const formerOutputs = transaction.outputs;
      const amount = Math.floor(
        Math.random() * (transaction.cache.balance + 1)
      );
      transaction.update(senderWallet, recipient, amount);
      expect(transaction.header.signature).toEqual(
        senderWallet.key.sign(sha256(JSON.stringify(formerOutputs)).toString())
      );
    });

    it("tests sender", () => {
      const amount = Math.floor(
        Math.random() * (transaction.cache.balance + 1)
      );
      transaction.update(senderWallet, recipient, amount);
      expect(transaction.cache.sender).toEqual(senderWallet.publicKey);
    });

    it("tests sender's cached balance", () => {
      const formerBalance = transaction.cache.balance;
      const amount = Math.floor(
        Math.random() * (transaction.cache.balance + 1)
      );
      transaction.update(senderWallet, recipient, amount);
      expect(formerBalance).toEqual(transaction.cache.balance + amount);
    });
  });

  describe("tests reward transaction", () => {
    const blockchainWallet = Wallet.blockchainWallet();
    const minerWallet = new Wallet();
    const rewardTransaction = Transaction.reward(blockchainWallet, minerWallet);

    it("tests mining reward", () => {
      expect(rewardTransaction.outputs[0].amount).toEqual(MINING_REWARD);
    });
  });
});
