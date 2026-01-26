"use strict";

const express = require("express");
const db = require("../db");
const router = new express.Router();

/** GET /healthz: DB health check endpoint
 *
 * Returns { status: "ok" } if DB is reachable.
 *
 * Authorization required: none
 */
router.get("/healthz", async function (req, res, next) {
  try {
    // Simple query to keep DB alive
    await db.query("SELECT 1");
    return res.json({ status: "ok" });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
