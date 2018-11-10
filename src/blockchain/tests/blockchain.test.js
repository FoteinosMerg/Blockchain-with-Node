"use strict";

const sha256 = require("crypto-js/sha256");
const Blockchain = require("../blockchain");
const Block = require("../block");

describe("Tests blockchain constructor", () => {
  it("tests blockchain construction without genesis block", () => {
    const blockchain = new Blockchain(false);
    expect(
      blockchain.chain.length === 0 && blockchain.pendingData.length === 0
    ).toEqual(true);
  });
  it("tests blockchain construction with genesis block", () => {
    const blockchain = new Blockchain();
    expect(
      blockchain.chain.length === 1 &&
        blockchain.chain[0].isGenesisBlock() &&
        blockchain.pendingData.length === 0
    ).toEqual(true);
  });
});

// Must be configured to 2, in order for this test to complete shortly
const { MINE_RATE } = require("../../config");

describe("General blockchaint tester", () => {
  const blockchain1 = new Blockchain();
  const blockchain2 = new Blockchain();

  blockchain1.storeData(["some-data-1", "some-data-2", "some-data-3"]);
  const block11 = blockchain1.createBlock();
  blockchain1.storeData(["some-data-4", "some-data-5"]);

  blockchain2.storeData(["other-data-1", "other-data-2", "other-data-3"]);
  const block21 = blockchain2.createBlock();
  blockchain2.storeData(["other-data-4", "other-data-5"]);
  const block22 = blockchain2.createBlock();

  it("tests storing data funcitonality", () => {
    expect(blockchain1.pendingData).toEqual(["some-data-4", "some-data-5"]);
  });

  it("tests storing data funcitonality", () => {
    expect(blockchain2.pendingData).toEqual([]);
  });

  it("tests create block functionality", () => {
    expect(blockchain1.chain[1].hash).toEqual(
      Block.hash(
        1,
        block11.nonce,
        blockchain1.chain[0].hash,
        block11.data,
        block11.timestamp,
        block11.difficulty
      )
    );
  });

  it("tests create block functionality", () => {
    expect(blockchain2.chain[2].hash).toEqual(
      Block.hash(
        2,
        block22.nonce,
        block21.hash,
        block22.data,
        block22.timestamp,
        block22.difficulty
      )
    );
  });

  it("tests replace chain functionality", () => {
    blockchain1.replaceChain(blockchain2.chain);
    expect(blockchain1.chain).toEqual(blockchain2.chain);
  });

  /*
  it("tests replace chain functionality", () => {
    const oldChain = blockchain2.chain;
    blockchain2.replaceChain(blockchain1.chain);
    expect(blockchain2.chain).toEqual(oldChain);
  });
  */
});
