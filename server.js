const express = require("express");
const app = express();
const { Client } = require("pg");
const PORT = process.env.PORT || 44444;
// const parse = require('pg-connection-string').parse // Parser for

// Use env file values for security
const client = new Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT
});

client
  .connect()
  .then(() => console.log("connected to DB"))
  .catch(e => console.error(e.stack));

app.get("/api/shorturl/:id", (req, res) => {
  client
    .query("SELECT * from urls where shorturl = $1", [req.param("id")])
    .then(data => {
      data.rows.length > 0 ? res.send(data.rows[0]) : res.sendStatus(404);
    })
    .catch(e => {
      console.error(e.stack);
      res.sendStatus(500);
    });
});

app.get("/api/status", (req, res) => {
  res.sendStatus(200);
});

// Constants
const HOST = "0.0.0.0";

app.listen(PORT, () => console.log(`Listening on PORT: ${PORT}`));
