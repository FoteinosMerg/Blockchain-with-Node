"use strict";

const Blockchain = require("../../blockchain");

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

  describe("Tests data storing and block creation", () => {
    const blockchain = new Blockchain();
    blockchain.storeData(["some-data-1", "some-data-2", "some-data-3"]);

    it("tests data storage", () => {
      expect(blockchain.pendingData).toEqual([
        "some-data-1",
        "some-data-2",
        "some-data-3"
      ]);
    });
  });
});
