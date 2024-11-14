require("dotenv").config();
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const path = require("path");

const app = express();
const port = 3000;

app.use(cors());

app.use(express.static(path.join(__dirname, "public")));

app.use(express.json());

const connection = mysql.createConnection({
  host: process.env.VITE_HOST,
  user: process.env.VITE_USER,
  password: process.env.VITE_PASSWORD,
  database: process.env.VITE_DATABASE,
});

connection.connect((err) => {
  if (err) {
    console.error("Error connecting to the database:", err);
    return;
  }
  console.log("Connected to the database");
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

app.get("/api/transactions", (req, res) => {
  connection.query(
    "SELECT * FROM Transactions ORDER BY Transaction_date DESC",
    (err, results) => {
      if (err) {
        console.error("Error fetching transactions:", err);
        res.status(500).send("Error fetching transactions");
        return;
      }
      res.json(results);
    }
  );
});

app.get("/api/searchTransactions", (req, res) => {
  const { query } = req.query;

  let sql = "SELECT * FROM Transactions WHERE 1=1";
  const queryParams = [];

  if (query && query.trim().length >= 3) {
    const searchValueWildCard = `%${query.trim()}%`;
    const searchValuePrefix = `${query.trim()}%`;

    sql += ` AND (Transaction_id LIKE ? OR Account_id LIKE ? OR Transaction_type LIKE ? OR Transaction_date LIKE ? OR Description LIKE ? OR Amount LIKE ? OR Balance LIKE ? OR Category LIKE ? OR category_id LIKE ? )`;

    queryParams.push(
      searchValuePrefix, // Transaction_id
      searchValuePrefix, // Account_id
      searchValueWildCard, // Transaction_type
      searchValuePrefix, // Transaction_date
      searchValueWildCard, // Description
      searchValueWildCard, // Amount
      searchValueWildCard, // Balance
      searchValueWildCard, // Category
      searchValuePrefix // category_id
    );
  }

  console.log("SQL Query:", sql);

  connection.query(sql, queryParams, (err, results) => {
    if (err) {
      console.error("Error fetching transactions:", err);
      res.status(500).send("Error fetching transactions");
      return;
    }
    res.json(results);
  });
});

app.post("/api/addTransaction", (req, res) => {
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

app.delete("/api/deleteTransactions", (req, res) => {
  const { Transaction_id } = req.body;

  if (!Array.isArray(Transaction_id) || Transaction_id.length === 0) {
    return res.status(400).json({
      success: false,
      message: "No transactions selected for deletion.",
    });
  }

  const sql = "DELETE FROM Transactions WHERE Transaction_id IN (?)";

  connection.query(sql, [Transaction_id], (err, result) => {
    if (err) {
      console.error("Error deleting transactions from database:", err);
      return res
        .status(500)
        .json({ success: false, message: "Database error" });
    }
    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Transactions not found" });
    }
    res.json({ success: true, message: "Transactions deleted successfully" });
  });
});
