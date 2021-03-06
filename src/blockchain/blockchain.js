"use strict";

const Block = require("./block");
const { proofOfWork } = require("./proof-tools");

class Blockchain {
  constructor(createGenesisBlock = true) {
    this.chain = [];
    this.pendingData = [];
    if (createGenesisBlock) this.chain.push(Block.genesis());
  }

  toString() {
    const stringList = [
      `
      type          : Blockchain\n`
    ];
    this.chain.forEach(block => stringList.push(block.toString() + "\n"));
    return stringList.join("");
  }

  storeData(data) {
    this.pendingData.push(...data);
  }

  createBlock() {
    let newBlock;

    if (this.chain.length) {
      const lastBlock = this.chain[this.chain.length - 1];

      const { nonce, difficulty } = proofOfWork(
        this.pendingData, //this.pendingData.join(""), //
        lastBlock.hash,
        lastBlock.nonce,
        lastBlock.difficulty,
        lastBlock.timestamp
      );

      newBlock = new Block(
        this.chain.length,
        nonce,
        lastBlock.hash,
        this.pendingData, //this.pendingData.join(""),
        difficulty
      );
    } else newBlock = Block.genesis(this.pendingData);

    this.pendingData = [];
    this.chain.push(newBlock);

    return newBlock;
  }

  replaceChain(newChain) {
    if (Blockchain.isValid(newChain) && newChain.length > this.chain.length) {
      this.chain = newChain;
    }
  }

  /* ------------------------------ Static methods -------------------------- */

  static isValid(chain) {
    // Void case
    if (!chain.length) return true;

    if (chain[0].isGenesisBlock()) {
      let currentBlock = chain[0];
      let index = 1;
      while (index < chain.length) {
        let nextBlock = chain[index];
        if (
          nextBlock.previousHash != currentBlock.hash ||
          nextBlock.hash !=
            Block.hash(
              nextBlock.index,
              nextBlock.nonce,
              nextBlock.previousHash,
              nextBlock.data,
              nextBlock.timestamp,
              nextBlock.difficulty
            )
        )
          return false;
        currentBlock = nextBlock;
        index++;
      }
      return true;
    } else return false; // No genesis block case
  }
}

module.exports = Blockchain;
