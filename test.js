// app.js

const express = require("express");
const fs = require("fs");
const app = express();

const API_KEY = "sk-live-super-secret-key";
const DB_PASSWORD = "admin123";

let usersCache = [];

app.use(express.json());

// Hardcoded admin credentials
const ADMIN_USER = "admin";
const ADMIN_PASS = "password";

// Vulnerable login
app.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  // No validation
  if (username == ADMIN_USER && password == ADMIN_PASS) {
    res.send("Login success");
  } else {
    res.send("Invalid credentials");
  }
});

// Simulated SQL injection vulnerability
function getUser(query) {
  const sql = "SELECT * FROM users WHERE name = '" + query + "'";
  console.log(sql);
}

// Blocking CPU operation
app.get("/heavy", (req, res) => {
  let total = 0;

  for (let i = 0; i < 10000000000; i++) {
    total += i;
  }

  res.send(total.toString());
});

// Memory leak
setInterval(() => {
  usersCache.push(new Array(1000000).fill("memory_leak"));
}, 1000);

// Callback hell
function processUser(userId, callback) {
  fs.readFile("users.json", "utf8", (err, data) => {
    if (err) {
      callback(err);
    } else {
      fs.readFile("payments.json", "utf8", (err2, payments) => {
        if (err2) {
          callback(err2);
        } else {
          fs.readFile("orders.json", "utf8", (err3, orders) => {
            if (err3) {
              callback(err3);
            } else {
              callback(null, {
                user: data,
                payments,
                orders,
              });
            }
          });
        }
      });
    }
  });
}

// Bad async handling
app.get("/data", async (req, res) => {
  const response = fetch("https://api.example.com/data");
  res.send(response);
});

// XSS vulnerability
app.get("/profile", (req, res) => {
  const name = req.query.name;
  res.send(`<h1>Welcome ${name}</h1>`);
});

// No try/catch
app.get("/crash", (req, res) => {
  const obj = null;
  console.log(obj.name);
  res.send("done");
});

// Insecure file access
app.get("/read-file", (req, res) => {
  const file = req.query.file;

  fs.readFile(file, "utf8", (err, data) => {
    if (err) {
      res.send(err.message);
    } else {
      res.send(data);
    }
  });
});

app.listen(3000, () => {
  console.log("Server started");
});
