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

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
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

// Endpoint for overview monthly spending
app.get("/api/lastMonthTransactions", (req, res) => {
  connection.query("SELECT Category, SUM(Amount) AS TotalAmount FROM Transactions WHERE Category != 'Income' AND Transaction_date >= '2024-09-01' AND Transaction_date < '2024-10-01' GROUP BY Category ORDER BY Category", (err, results) => {
    if (err) {
      console.error("Error fetching transactions:", err);
      res.status(500).send("Error fetching transactions");
      return;
    }
    res.json(results); // Send results as JSON
  });
});


// Endpoint for getting 10 most recent transactions
app.get("/api/recentTransactions", (req, res) => {
  connection.query("SELECT Transaction_id, Description, Amount, DATE_FORMAT(Transaction_date, '%m-%d') AS date FROM Transactions ORDER BY Transaction_date DESC LIMIT 10", (err, results) => {
    if (err) {
      console.error("Error fetching transactions:", err);
      res.status(500).send("Error fetching transactions");
      return;
    }
    res.json(results); // Send results as JSON
  });
});

// transactions query from search form
app.get("/api/searchTransactions", (req, res) => {
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
  } = req.query;

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
  if (Transaction_type && Transaction_type.trim() !== "") {
    sql += " AND Transaction_type = ?";
    queryParams.push(Transaction_type.trim());
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
  if (Balance && Balance.trim() !== "") {
    sql += " AND Balance = ?";
    queryParams.push(Balance.trim());
  }
  if (Category && Category.trim() !== "") {
    sql += " AND Category LIKE ?";
    queryParams.push(`%${Category.trim()}%`);
  }
  if (Category_id && Category_id.trim() !== "") {
    sql += " AND Category_id LIKE ?";
    queryParams.push(`%${Category_id.trim()}%`);
  }

  // Execute the query
  connection.query(sql, queryParams, (err, results) => {
    if (err) {
      console.error("Error fetching transactions:", err);
      res.status(500).send("Error fetching transactions");
      return;
    }
    res.json(results);
  });
});

// Endpoint to add a new transaction
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

// Endpoint to delete a new transaction
app.delete("/api/deleteTransactions", (req, res) => {
  const { Transaction_id } = req.body;

  // Check if the array exists and has items
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
