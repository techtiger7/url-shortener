const express = require("express")
const app = express()
var bodyParser = require('body-parser') // For accessing POST HTTP request body
const dns = require("dns") // For checking that a URL exists

const { Client } = require("pg")
const PORT = process.env.PORT || 44444

app.use(function(req, res, next){
  console.log(req.method + " " + req.path + " - " + req.ip)
  next()
})

// parse HTTP requests with Content-type: application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}))

// parse HTTP requests with Content-type: application/json
app.use(bodyParser.json())

// Use env file values for security
const client = new Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT
})

client.connect()
.then(() => console.log("Successfully connected to database."))
.catch(e => console.error(e.stack))


app.get("/api/shorturl/:id", (req, res) => {
  client.query("SELECT * FROM urls WHERE shorturl = $1 ;", [req.params.id])
    .then(data => {
      data.rows.length > 0 ? res.send(data.rows[0]) : res.sendStatus(404)
    })
    .catch(e => {
      console.error(e.stack)
      res.sendStatus(500)
    })
})

app.post("/api/shorturl/new", (req, res) => {
  if(!req.body) return res.sendStatus(400)
  client.query("INSERT INTO urls (originalurl) VALUES ($1) RETURNING *;", [req.body.url])
    .then(data => {
      data.rows.length > 0 ? res.send(data.rows[0]) : res.sendStatus(404)
    })
    .catch(e => {
      console.error(e.stack)
      res.sendStatus(500)
    })
})

app.get("/api/status", (req, res) => {
  res.sendStatus(200)
});

app.listen(PORT, () => console.log(`Listening on PORT: ${PORT}`))