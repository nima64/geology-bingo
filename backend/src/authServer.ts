// const express = require("express");
import express from "express";
import session from "express-session";
import { createServer } from "node:http";
import { join } from "node:path";
const { Server } = require("socket.io");
import crypto from "crypto";
// const session = require("express-session");

const PORT = process.env.PORT || 8080;

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const authServer = createServer(app);

authServer.listen(PORT);

let currentSessionSecret = crypto.randomUUID();

const sessionMiddleware = session({
  secret: currentSessionSecret,
  resave: true,
  saveUninitialized: true,
});

// middleware to test if authenticated
function isAuthenticated(req: any, res: any, next: any) {
  let session: any = req.session;
  if (session.user) next();
  else next("route");
}

app.use(sessionMiddleware);

app.get("/", function (req, res) {
  // let session: any = req.session;
  // this is only called when there is an authentication user due to isAuthenticated
  res.send("hello, " + "helloworld" + "!" + ' <a href="/logout">Logout</a>');
});

app.post(
  "/login",
  express.urlencoded({ extended: false }),
  (req, res, next) => {
    // regenerate the session, which is good practice to help
    // guard against forms of session fixation
    req.session.regenerate(function (err) {
      if (err) next(err);

      req.session.user = req.body.user;

      // save the session before redirection to ensure page
      // load does not happen before session is saved
      req.session.save(function (err) {
        if (err) return next(err);
        res.redirect("/");
      });
    });
  }
);

app.post("/room", express.urlencoded({ extended: false }), (req, res, next) => {
  // regenerate the session, which is good practice to help
  // guard against forms of session fixation
  req.session.regenerate(function (err) {
    if (err) next(err);
    if (!req.session.user) {
      const err = new Error("Unauthorized") as Error & { status: number };
      err.status = 401;
      return next(err);
    }

    req.session.room = req.body.room;

    // save the session before redirection to ensure page
    // load does not happen before session is saved
    req.session.save(function (err) {
      if (err) return next(err);
      res.redirect("/");
    });
  });
});

app.get("/logout", function (req, res, next) {
  req.session.user = null;
  req.session.save(function (err: any) {
    if (err) next(err);

    // regenerate the session, which is good practice to help
    // guard against forms of session fixation
    req.session.regenerate((err: any) => {
      if (err) next(err);
      res.redirect("/");
    });
  });
});

export default authServer;
export { sessionMiddleware };

// io.engine.use(sessionMiddleware);

// io.on("connection", (socket: any) => {
//   const session = socket.request.session;
// });
