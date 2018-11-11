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

// Must be configured to 1, in order for this test to complete fastly
const { MINE_RATE } = require("../../config");

describe("General blockchaint tester", () => {
  let blockchain_1, block_11;
  let blockchain_2, block_21, block_22;

  beforeEach(() => {
    blockchain_1 = new Blockchain(); // Will have length 2
    blockchain_2 = new Blockchain(); // Will have length 3

    blockchain_1.storeData(["some-data-1", "some-data-2", "some-data-3"]);
    block_11 = blockchain_1.createBlock();
    blockchain_1.storeData(["some-data-4", "some-data-5"]);

    blockchain_2.storeData(["other-data-1", "other-data-2", "other-data-3"]);
    block_21 = blockchain_2.createBlock();
    blockchain_2.storeData(["other-data-4", "other-data-5"]);
    block_22 = blockchain_2.createBlock();
  });

  it("tests storing data funcitonality", () => {
    expect(blockchain_1.pendingData).toEqual(["some-data-4", "some-data-5"]);
  });

  it("tests storing data funcitonality", () => {
    expect(blockchain_2.pendingData).toEqual([]);
  });

  it("tests create block functionality", () => {
    expect(blockchain_1.chain[1].hash).toEqual(
      Block.hash(
        1,
        block_11.nonce,
        blockchain_1.chain[0].hash,
        block_11.data,
        block_11.timestamp,
        block_11.difficulty
      )
    );
  });

  it("tests create block functionality", () => {
    expect(blockchain_2.chain[2].hash).toEqual(
      Block.hash(
        2,
        block_22.nonce,
        block_21.hash,
        block_22.data,
        block_22.timestamp,
        block_22.difficulty
      )
    );
  });

  it("tests replace chain functionality", () => {
    blockchain_1.replaceChain(blockchain_2.chain);
    expect(blockchain_1.chain).toEqual(blockchain_2.chain);
  });

  ///*
  it("tests replace chain functionality", () => {
    blockchain_2.replaceChain(blockchain_1.chain);
    expect(blockchain_2.chain).not.toEqual(blockchain_1.chain);
  });
  //*/

  it("tests chain validity", () => {
    expect(
      Blockchain.isValid(blockchain_1.chain) &&
        Blockchain.isValid(blockchain_2.chain) &&
        Blockchain.isValid([]) // Edge case
    ).toEqual(true);
  });

  it("tests chain invalidity when the first block is not genesis", () => {
    blockchain_2.chain[0].hash = "tampered";
    expect(Blockchain.isValid(blockchain_2.chain)).toEqual(false);
  });

  it("tests chain invalidity in case of tampered hash chain", () => {
    blockchain_2.chain[1].hash = "tampered";
    expect(Blockchain.isValid(blockchain_2.chain)).toEqual(false);
  });

  it("tests chain invalidity in case of tampered data", () => {
    blockchain_2.chain[1].data = "tampered";
    expect(Blockchain.isValid(blockchain_2.chain)).toEqual(false);
  });

  it("tests chain invalidity in case of tampered proof", () => {
    blockchain_2.chain[1].nonce = -1;
    expect(Blockchain.isValid(blockchain_2.chain)).toEqual(false);
  });

  it("tests chain invalidity in case of tampered last hash", () => {
    blockchain_2.chain[blockchain_2.chain.length - 1].hash = "tampered";
    expect(Blockchain.isValid(blockchain_2.chain)).toEqual(false);
  });
});
