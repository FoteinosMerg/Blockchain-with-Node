"use strict";

const Block = require("../block");
const sha256 = require("crypto-js/sha256");

describe("tests hash function", () => {
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
});
