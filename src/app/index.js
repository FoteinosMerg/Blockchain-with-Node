"use strict";

const router = require("express").Router();

router.get("/", (req, res) => {
  res.json({ message: "Here is homepage" });
});

router.use("/blockchain", require("./routes/blockchain"));
router.use("/wallet", require("./routes/wallet"));
router.use("/p2p-network", require("./routes/p2p-network"));

module.exports = router;
