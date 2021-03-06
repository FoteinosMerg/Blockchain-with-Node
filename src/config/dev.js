"use strict";
module.exports = {
  /* Node configuration */
  ADDRESS: process.env.ADDRESS || "127.0.0.1",
  HTTP_PORT: process.env.HTTP_PORT || 5000,
  P2P_PORT: process.env.P2P_PORT || 8080,
  TARGET_PEER: process.env.TARGET_PEER || "",
  /* Blockchain configuration */
  DIFFICULTY: process.env.DIFFICULTY || 1,
  MINE_RATE: process.env.MINE_RATE || 3000, //msecs
  INITIAL_BALANCE: process.env.INITIAL_BALANCE || 500,
  MINING_REWARD: process.env.MINING_REWARD || 50
};
