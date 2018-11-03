"use strict";

const ws = require("ws");
const { P2P_PORT } = require("../config");
const PEERS = process.env.PEERS ? process.env.PEERS.split(", ") : [];
const MESSAGE_TYPES = {
  chain: "CHAIN",
  transaction: "TRANSACTION"
};

class P2PServer {
  constructor(blockchain, transactionPool) {
    this.blockchain = blockchain;
    this.transactionPool = transactionPool;
    this.sockets = [];
  }

  listen() {
    this.server = new ws.Server({ port: P2P_PORT }, () => {
      console.log(
        `\n * Listening for peer-to-peer connections on port ${P2P_PORT}`
      );
    });

    // Establish connection to already cached peers
    PEERS.forEach(peer => {
      const socket = new ws(peer);
      socket.on("open", () => {
        this.connectTo(socket, () =>
          console.log(`\n * New socket to peer ${peer}`)
        );
      });
    });

    // Event handler for admitting connections from newly appearing peers
    this.server.on("connection", (socket, req) => {
      this.connectTo(socket, () =>
        console.log(
          `\n * New socket from peer ${req.connection.remoteAddress}: ${
            req.connection.remotePort
          }`
        )
      );
    });
  }

  connectTo(socket, callback) {
    /*
    Core helper function for server establishment
    */
    this.sockets.push(socket);
    callback();
    this.messageHandler(socket);
    this.sendChainFrom(socket);
  }

  synchronizeChains() {
    /*
    Resolves chain conflicts among network nodes by choosing a longest one
    */
    this.sockets.forEach(socket => this.sendChainFrom(socket));
  }

  broadcastTransaction(transaction) {
    /*
    Broadcastast the inserted transaction to the whole p2p-network
    */
    this.sockets.forEach(socket => this.sendTransaction(socket, transaction));
  }

  messageHandler(socket) {
    /*
    Handler for message events (incoming messages) according to type
    */
    socket.on("message", jsonMessage => {
      const message = JSON.parse(jsonMessage);
      switch (message.type) {
        case MESSAGE_TYPES.chain:
          this.blockchain.replaceChain(message.chain);
          break;
        case MESSAGE_TYPES.transaction:
          this.transactionPool.update(message.transaction);
          break;
      }
    });
  }

  /* ---------------------- (Outgoing) message actions -----------------------*/

  sendChainFrom(socket) {
    /*
    type: "CHAIN"
    */
    socket.send(
      JSON.stringify({
        type: MESSAGE_TYPES.chain,
        chain: this.blockchain.chain
      })
    );
  }

  sendTransaction(socket, transaction) {
    /*
    type: "TRANSACTION"
    */
    socket.send(
      JSON.stringify({
        type: MESSAGE_TYPES.transaction,
        transaction: transaction
      })
    );
  }
}

/* ------------------------------ End of class -------------------------------*/

module.exports = P2PServer;
