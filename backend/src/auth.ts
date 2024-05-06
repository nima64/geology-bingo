// const express = require("express");
import express from "express";
import session from "express-session";
import { createServer } from "node:http";
import { join } from "node:path";
const { Server } = require("socket.io");
import crypto from "crypto";
// const session = require("express-session");

const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const httpServer = createServer(app);

httpServer.listen(PORT);

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

app.get("/", function (req, res) {
  // let session: any = req.session;
  // this is only called when there is an authentication user due to isAuthenticated
  res.send("hello, " + "helloworld" + "!" + ' <a href="/logout">Logout</a>');
});

// app.get("/", function (req, res) {
//   res.send(
//     '<form action="/login" method="post">' +
//       'Username: <input name="user"><br>' +
//       'Password: <input name="pass" type="password"><br>' +
//       '<input type="submit" text="Login"></form>'
//   );
// });

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

app.use(sessionMiddleware);

export default httpServer;

// io.engine.use(sessionMiddleware);

// io.on("connection", (socket: any) => {
//   const session = socket.request.session;
// });
