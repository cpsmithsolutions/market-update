"use strict";

const express = require("express");

const cors = require("cors");
const { NotFoundError } = require("./errors/expressError");
const morgan = require("morgan");
const { authenticateJWT } = require("./middleware/auth");

const authRoutes = require("./routes/auth");
const usersRoutes = require("./routes/users");
const healthRoutes = require("./routes/health");

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan("tiny"));

app.use(authenticateJWT);


app.use("/auth", authRoutes);
app.use("/users", usersRoutes);
app.use("/", healthRoutes);

//handles 404 errors
app.use(function (req, res, next) {
  return next(new NotFoundError());
});

/** Generic error handler; anything unhandled goes here. */
app.use(function (err, req, res, next) {
  if (process.env.NODE_ENV !== "test") console.error(err.stack);
  const status = err.status || 500;
  const message = err.message;

  return res.status(status).json({
    error: { message, status },
  });
});

module.exports = app;
