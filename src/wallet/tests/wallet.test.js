"use strict";

const sha256 = require("crypto-js/sha256");

const Transaction = require("../transaction");
const Wallet = require("../wallet");
const Blockchain = require("../../blockchain");
const TransactionPool = require("../transaction-pool");

const { INITIAL_BALANCE } = require("../../config");

describe("Tests wallet construction and signature", () => {
  const wallet = new Wallet();
  it("tests wallet constructor", () => {
    expect(wallet).toEqual({
      balance: INITIAL_BALANCE,
      key: wallet.key,
      publicKey: wallet.publicKey
    });
  });
  it("tests signature", () => {
    const transaction = new Transaction();
    transaction.outputs = ["a", "n", "y", "t", "h", "i", "n", "g"];
    wallet.sign(transaction);
    expect(transaction.header.signature).toEqual(
      wallet.key.sign(sha256(JSON.stringify(transaction.outputs)).toString())
    );
  });
  it("tests blockchain wallet construction", () => {
    const blockchainWallet = Wallet.blockchainWallet();
    expect(blockchainWallet.address).toEqual("__blockchain_wallet__");
  });
});

describe("Transaction suite tester", () => {
  const wallet_1 = new Wallet();
  const wallet_2 = new Wallet();
  const blockchain = new Blockchain();
  const transactionPool = new TransactionPool();

  it("checks balance recalculation before any transactions performed", () => {
    wallet_1.recalculateBalance(blockchain);
    expect(wallet_1.balance).toEqual(INITIAL_BALANCE);
  });

  // Will hold payments performed by wallet_1
  let transaction_1 = wallet_1.performTransaction(
    wallet_2.publicKey,
    100,
    blockchain,
    transactionPool
  ); // wallet_1's cached balance is 400

  it("checks that transaction_1 has been cached", () => {
    expect(transactionPool.transactions).toEqual([transaction_1]);
  });

  transaction_1 = wallet_1.performTransaction(
    wallet_2.publicKey,
    50,
    blockchain,
    transactionPool
  ); // wallet_1's cached balance is 350

  it("checks that transaction_1 has been updated but not cached anew", () => {
    expect(transactionPool.transactions).toEqual([transaction_1]);
  });

  it("checks failure in case of amount exceeding balance", () => {
    const failedTransaction = wallet_1.performTransaction(
      wallet_2.publicKey,
      INITIAL_BALANCE + 1, // edge case before first block mining
      blockchain,
      transactionPool
    );
    expect(failedTransaction).toEqual(undefined);
  });

  // Store current transactions as pending data
  blockchain.storeData(transactionPool.transactions);

  it("checks immediate balance recalculation after block mining", () => {
    // ``Mining``
    blockchain.createBlock();

    // Balance recalculation
    wallet_1.recalculateBalance(blockchain);
    wallet_2.recalculateBalance(blockchain);
    expect(wallet_1.balance === 350 && wallet_2.balance === 650).toEqual(true);
  });
});
