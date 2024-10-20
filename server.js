const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const port = 3000;

// Middleware to allow cross-origin requests
app.use(cors());

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
