require("dotenv").config();
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const path = require("path");

const app = express();
const port = 3000;

// Middleware to allow cross-origin requests
app.use(cors());

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, "public")));

// use express to process json
app.use(express.json());

// Create a MySQL connection
const connection = mysql.createConnection({
  host: process.env.VITE_HOST, // e.g., localhost
  user: process.env.VITE_USER, // your MySQL username
  password: process.env.VITE_PASSWORD, // your MySQL password
  database: process.env.VITE_DATABASE, // your database name
});

// Connect to the database
connection.connect((err) => {
  if (err) {
    console.error("Error connecting to the database:", err);
    return;
  }
  console.log("Connected to the database");
});

// API endpoint to get all transactions
app.get("/api/transactions", (req, res) => {
  connection.query("SELECT * FROM Transactions", (err, results) => {
    if (err) {
      console.error("Error fetching transactions:", err);
      res.status(500).send("Error fetching transactions");
      return;
    }
    res.json(results); // Send results as JSON
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

// transactions query from search form
app.get("/api/searchTransactions", (req, res) => {
  const { Transaction_id, Account_id, Transaction_date, Description, Amount } =
    req.query;

  let sql = "SELECT * FROM Transactions WHERE 1=1";
  const queryParams = [];

  if (Transaction_id && Transaction_id.trim() !== "") {
    sql += " AND Transaction_id = ?";
    queryParams.push(Transaction_id.trim());
  }
  if (Account_id && Account_id.trim() !== "") {
    sql += " AND Account_id = ?";
    queryParams.push(Account_id.trim());
  }
  if (Transaction_date && Transaction_date.trim() !== "") {
    sql += " AND Transaction_date = ?";
    queryParams.push(Transaction_date.trim());
  }
  if (Description && Description.trim() !== "") {
    sql += " AND Description LIKE ?";
    queryParams.push(`%${Description.trim()}%`);
  }
  if (Amount && Amount.trim() !== "") {
    sql += " AND Amount = ?";
    queryParams.push(Amount.trim());
  }

  // Log the query and parameters for debugging
  console.log("SQL Query:", sql);
  console.log("Query Params:", queryParams);

  // Execute the query
  connection.query(sql, queryParams, (err, results) => {
    if (err) {
      console.error("Error fetching transactions:", err);
      res.status(500).send("Error fetching transactions");
      return;
    }
    console.log("Query results:", results);
    res.json(results); // Send the filtered results as JSON
  });
});

// Endpoint to add a new transaction
app.post("/api/addTransaction", (req, res) => {
  //console.log(req.body);

  const {
    Transaction_id,
    Account_id,
    Transaction_type,
    Transaction_date,
    Description,
    Amount,
    Balance,
    Category,
    Category_id,
  } = req.body;

  const sql =
    "INSERT INTO Transactions (Transaction_id, Account_id, Transaction_type, Transaction_date, Description, Amount, Balance, Category, Category_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";

  connection.query(
    sql,
    [
      Transaction_id,
      Account_id,
      Transaction_type,
      Transaction_date,
      Description,
      Amount,
      Balance,
      Category,
      Category_id,
    ],
    (err, result) => {
      if (err) {
        console.error("Error inserting into database:", err);
        return res
          .status(500)
          .json({ success: false, message: "Database error" });
      }
      res.json({ success: true, message: "Transaction added successfully" });
    }
  );
});
