"use strict";

const sha256 = require("crypto-js/sha256");
const Block = require("../block");
const { DIFFICULTY } = require("../../config");

describe("Tests hash function and block constructor", () => {
  // Expected hash
  const hash =
    "afb590f7d47d9403d20c1061c76cd21e157f392614e407231bff35f2b68bcaeb";

  // Parameters
  const index = 99;
  const nonce = 666;
  const previousHash = "-some-random-32-bit-string-here-";
  const data = "__could_be_anything_serialized__";
  const timestamp = 1541770548271;
  const difficulty = 6;

  it("tests hash value for the above parameters", () => {
    expect(
      sha256(
        `${index}${nonce}${previousHash}${data}${timestamp}${difficulty}`
      ).toString()
    ).toEqual(hash);
  });

  it("tests block construction via hash", () => {
    const block = new Block(index, nonce, previousHash, data, difficulty);
    expect(block.hash).toEqual(
      sha256(
        `${block.index}${block.nonce}${block.previousHash}${block.data}${
          block.timestamp
        }${block.difficulty}`
      ).toString()
    );
  });
});

describe("Tests genesis block construction and validation", () => {
  const genesisBlock = Block.genesis("__could_be_anything_serialized__");
  it("tests valid genesis blocks validation", () => {
    expect(genesisBlock.isGenesisBlock()).toEqual(true);
  });
  it("tests non-valid genesis blocks validation", () => {
    const nonGenesisBlock = new Block(
      1,
      0,
      "__there_is_no_previous_hash__",
      "__could_be_anything_serialized__",
      DIFFICULTY
    );
    expect(nonGenesisBlock.isGenesisBlock()).toEqual(false);
  });
  it("tests non-valid genesis blocks validation", () => {
    const nonGenesisBlock = new Block(
      0,
      1,
      "__there_is_no_previous_hash__",
      "__could_be_anything_serialized__",
      DIFFICULTY
    );
    expect(nonGenesisBlock.isGenesisBlock()).toEqual(false);
  });
  it("tests non-valid genesis blocks validation", () => {
    const nonGenesisBlock = new Block(
      0,
      0,
      "_____could_be_anything_else_____",
      "__could_be_anything_serialized__",
      DIFFICULTY
    );
    expect(nonGenesisBlock.isGenesisBlock()).toEqual(false);
  });
  it("tests non-valid genesis blocks validation", () => {
    const nonGenesisBlock = new Block(
      0,
      0,
      "__there_is_no_previous_hash__",
      "__could_be_anything_serialized__",
      DIFFICULTY + 1
    );
    expect(nonGenesisBlock.isGenesisBlock()).toEqual(false);
  });
});
