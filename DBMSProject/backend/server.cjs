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

// Endpoint for getting all transactions ordered by month
app.get("/api/allTransactionsByMonth", (req, res) => {
  connection.query(
    `SELECT 
       Transaction_id, 
       Balance,
       DATE_FORMAT(Transaction_date, '%Y-%m-%d') AS date 
     FROM Transactions 
     ORDER BY date ASC`,
    (err, results) => {
      if (err) {
        console.error("Error fetching transactions:", err);
        res.status(500).send("Error fetching transactions");
        return;
      }
      res.json(results); // Send results as JSON
    }
  );
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

app.get("/api/goals", (req, res) => {
  connection.query("SELECT * FROM Goals", (err, results) => {
    if (err) {
      console.error("Error fetching goals:", err);
      res.status(500).send("Error fetching goals");
      return;
    }
    res.json(results); // Send results as JSON
  });
});

app.get("/api/searchGoals", (req, res) => {
  const { query } = req.query;

  let sql = "SELECT * FROM Goals WHERE 1=1";
  const queryParams = [];

  if (query && query.trim().length >= 3) {
    const searchValueWildCard = `%${query.trim()}%`;
    const searchValuePrefix = `${query.trim()}%`;

    sql += ` AND (Goal_id LIKE ? OR Goal_name LIKE ? OR Target_amount LIKE ? OR Current_amount LIKE ? OR Target_date LIKE ? OR Created_at LIKE ? )`;

    queryParams.push(
      searchValuePrefix, // Goal_id  may cause problems in future look here
      searchValuePrefix, // Goal_name
      searchValueWildCard, // Target_amount
      searchValuePrefix, // Current_date
      searchValueWildCard, // Target_date
      searchValueWildCard // Created_at
    );
  }

  console.log("SQL Query:", sql);

  connection.query(sql, queryParams, (err, results) => {
    if (err) {
      console.error("Error fetching goals:", err);
      res.status(500).send("Error fetching goals");
      return;
    }
    res.json(results);
  });
});

app.post("/api/addGoal", (req, res) => {
  const {
    Goal_id,
    Goal_name,
    Target_amount,
    Current_amount,
    Target_date,
    Created_at,
  } = req.body;

  const sql =
    "INSERT INTO Goals (Goal_id, Goal_name, Target_amount, Current_amount, Target_date, Created_at) VALUES (?, ?, ?, ?, ?, ?)";

  connection.query(
    sql,
    [
      Goal_id,
      Goal_name,
      Target_amount,
      Current_amount,
      Target_date,
      Created_at,
    ],
    (err, result) => {
      if (err) {
        console.error("Error inserting into database:", err);
        return res
          .status(500)
          .json({ success: false, message: "Database error" });
      }
      res.json({ success: true, message: "Goal added successfully" });
    }
  );
});

app.delete("/api/deleteGoals", (req, res) => {
  const { Goal_id } = req.body;

  if (!Array.isArray(Goal_id) || Goal_id.length === 0) {
    return res.status(400).json({
      success: false,
      message: "No goals selected for deletion.",
    });
  }

  const sql = "DELETE FROM Goals WHERE Goal_id IN (?)";

  connection.query(sql, [Goal_id], (err, result) => {
    if (err) {
      console.error("Error deleting goals from database:", err);
      return res
        .status(500)
        .json({ success: false, message: "Database error" });
    }
    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Goals not found" });
    }
    res.json({ success: true, message: "Goals deleted successfully" });
  });
});
