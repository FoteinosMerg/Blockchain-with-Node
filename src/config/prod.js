"use strict";
module.exports = {
  /* Node configuration */
  ADDRESS: process.env.ADDRESS,
  HTTP_PORT: process.env.HTTP_PORT,
  P2P_PORT: process.env.P2P_PORT,
  TARGET_PEER: process.env.TARGET_PEER || "",
  PEERS: process.env.PEERS, // to be removed
  /* Blockchain configuration */
  DIFFICULTY: process.env.DIFFICULTY,
  MINE_RATE: process.env.MINE_RATE,
  INITIAL_BALANCE: process.env.INITIAL_BALANCE,
  MINING_REWARD: process.env.MINING_REWARD
};
