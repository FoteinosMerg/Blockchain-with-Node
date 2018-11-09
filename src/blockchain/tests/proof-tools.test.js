"use strict";

const sha256 = require("crypto-js/sha256");
const { MINE_RATE } = require("../../config");

const { proofOfWork, validProof, adjustDifficulty } = require("../proof-tools");

describe("Tests difficulty adjustment", () => {
  const difficulty = 10;
  const previousMoment = 100;
  it("tests difficulty increment", () => {
    const currentMoment = previousMoment + MINE_RATE;
    expect(adjustDifficulty(difficulty, currentMoment, previousMoment)).toEqual(
      difficulty - 1
    );
  });
  it("tests difficulty decrement", () => {
    const currentMoment = previousMoment + MINE_RATE / 2;
    expect(adjustDifficulty(difficulty, currentMoment, previousMoment)).toEqual(
      difficulty + 1
    );
  });
});

describe("Tests the valid proof function", () => {});
