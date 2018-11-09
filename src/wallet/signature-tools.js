"use strict";

const Elliptic = require("elliptic");
const ellipticCurve = new Elliptic.ec("secp256k1");
const sha256 = require('crypto-js/sha256')

function verifySignature(publicKey, signature, signedData) {
  return ellipticCurve
    .keyFromPublic(publicKey, "hex")
    .verify(signedData, signature);
}

class Signer {
  static genKeyPair() {
    return ellipticCurve.genKeyPair();
  }

  static verify(transaction) {
    return verifySignature(
      transaction.cache.sender,
      transaction.header.signature,
      sha256(JSON.stringify(transaction.outputs)).toString()
    );
  }
}

module.exports = Signer;
