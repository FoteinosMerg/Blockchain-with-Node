"use strict";

const ellipticCurve = new require("elliptic").ec("secp256k1");

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
    return Signer.verifySignature(
      transaction.header.sender,
      transaction.header.signature,
      sha256(JSON.stringify(transaction.outputs)).toString()
    );
  }
}

module.exports = Signer;
