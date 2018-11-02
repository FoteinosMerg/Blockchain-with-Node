"use strict";

const ellipticCurve = new require("elliptic").ec("secp256k1");

class Signer {
  static genKeyPair() {
    return ellipticCurve.genKeyPair();
  }

  static verifySignature(publicKey, signature, signedData) {
    return ellipticCurve
      .keyFromPublic(publicKey, "hex")
      .verify(signedData, signature);
  }
}

module.exports = Signer;
