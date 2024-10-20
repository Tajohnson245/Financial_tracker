const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const path = require('path');

const app = express();
const port = 3000;

// Middleware to allow cross-origin requests
app.use(cors());

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Create a MySQL connection
const connection = mysql.createConnection({
    host: 'localhost',     // e.g., localhost
    user: 'myuser', // your MySQL username
    password: 'mypassword', // your MySQL password
    database: 'financial_tracker' // your database name
});

// Connect to the database
connection.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the database');
});

// API endpoint to get all transactions
app.get('/api/transactions', (req, res) => {
    connection.query('SELECT * FROM Transactions', (err, results) => {
        if (err) {
            console.error('Error fetching transactions:', err);
            res.status(500).send('Error fetching transactions');
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
app.get('/api/searchTransactions', (req, res) => {
    // Extract query parameters
    const { Transaction_id, Account_id, Transaction_date, Description, Amount } = req.query;

    // Construct the SQL query based on the provided parameters
    let sql = 'SELECT * FROM Transactions WHERE 1=1'; // Default query
    const queryParams = [];

    if (Transaction_id) {
        sql += ' AND Transaction_id = ?';
        queryParams.push(Transaction_id);
    }
    if (Account_id) {
        sql += ' AND Account_id = ?';
        queryParams.push(Account_id);
    }
    if (Transaction_date) {
        sql += ' AND Transaction_date = ?';
        queryParams.push(Transaction_date);
    }
    if (Description) {
        sql += ' AND Description LIKE ?';
        queryParams.push(`%${Description}%`);
    }
    if (Amount) {
        sql += ' AND Amount = ?';
        queryParams.push(Amount);
    }

    // Execute the query
    connection.query(sql, queryParams, (err, results) => {
        if (err) {
            console.error('Error fetching transactions:', err);
            res.status(500).send('Error fetching transactions');
            return;
        }
        res.json(results); // Send the filtered results as JSON
    });
});