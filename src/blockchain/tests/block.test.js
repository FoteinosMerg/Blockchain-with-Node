"use strict";

const Block = require("../block");

describe("test testing", () => {
  let intData, stringData;
  beforeEach(() => {
    intData = 0;
    stringData = "0";
  });
  it("tests `==` operator", () => {
    expect(intData == stringData).toEqual(true);
  });
  it("tests `===` operator", () => {
    expect(intData === stringData).toEqual(false);
  });
});
