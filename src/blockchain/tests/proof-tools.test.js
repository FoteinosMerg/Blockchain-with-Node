"use strict";

const sha256 = require("crypto-js/sha256");
const { MINE_RATE } = require("../../config");

const { proofOfWork, validProof, adjustDifficulty } = require("../proof-tools");

describe("Tests the proof of work algorithm", () => {
  it("first check", () => {
    expect(
      proofOfWork(
        "some-data-1 some-data-2",
        "5abf097dedfdfaa17c5c859f428caf88b06b1ae15b6d697c3750a49e7d91dbc5",
        0,
        4,
        1541837998493
      )
    ).toEqual({ nonce: 874, difficulty: 3 });
  });
  it("second check", () => {
    expect(
      proofOfWork(
        "some-data-3 some-data-4 some-data-5",
        "c36bf7ffe1a48dc988572a04872559aa2c63397d6b71679aff5608c296d57982",
        874,
        3,
        1541838017550
      )
    ).toEqual({ nonce: 102, difficulty: 2 });
  });
  it("third check", () => {
    expect(
      proofOfWork(
        "some-data-6 some-data-7 ",
        "5002f21c19a4f24a4021d724f3a6b298669d953ca8a1ce794f2e4e10f735228a",
        102,
        2,
        1541838042769
      )
    ).toEqual({ nonce: 4, difficulty: 1 });
  });
  it("fourth check", () => {
    expect(
      proofOfWork(
        "some-data-8 ",
        "16285a90a82b050faa38c3bfffffc0e77946aa417dbdeb8b27e3de4f3b60a328",
        4,
        1,
        1541838089702
      )
    ).toEqual({ nonce: 0, difficulty: 0 });
  });
});

describe("Tests valid proof functionality", () => {
  it("tests case with 3 leading zeros", () => {
    expect(
      validProof(
        "some-data-1 some-data-2",
        "5abf097dedfdfaa17c5c859f428caf88b06b1ae15b6d697c3750a49e7d91dbc5",
        0,
        874,
        3
      )
    ).toEqual(true);
  });
  it("tests case with 2 leading zeros", () => {
    expect(
      validProof(
        "some-data-3 some-data-4 some-data-5",
        "c36bf7ffe1a48dc988572a04872559aa2c63397d6b71679aff5608c296d57982",
        874,
        102,
        2
      )
    ).toEqual(true);
  });
  it("tests case with 1 leading zeros", () => {
    expect(
      validProof(
        "some-data-6 some-data-7 ",
        "5002f21c19a4f24a4021d724f3a6b298669d953ca8a1ce794f2e4e10f735228a",
        102,
        4,
        1
      )
    ).toEqual(true);
  });
  it("tests case with 0 leading zeros", () => {
    expect(
      validProof(
        "some-data-8 ",
        "16285a90a82b050faa38c3bfffffc0e77946aa417dbdeb8b27e3de4f3b60a328",
        4,
        0,
        0
      )
    ).toEqual(true);
  });
});

describe("Tests difficulty adjustment", () => {
  const difficulty = 10;
  const previousMoment = 100;
  it("tests difficulty increment in first edge case", () => {
    const currentMoment = previousMoment + MINE_RATE;
    expect(adjustDifficulty(difficulty, currentMoment, previousMoment)).toEqual(
      difficulty - 1
    );
  });
  it("tests difficulty increment in second edge case", () => {
    const currentMoment = previousMoment + MINE_RATE;
    expect(adjustDifficulty(0, currentMoment, previousMoment)).toEqual(1);
  });
  it("tests difficulty decrement", () => {
    const currentMoment = previousMoment + MINE_RATE / 2;
    expect(adjustDifficulty(difficulty, currentMoment, previousMoment)).toEqual(
      difficulty + 1
    );
  });
});
