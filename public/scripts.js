//transaction search event handler
document.getElementById("transactionSearchForm").addEventListener('submit', function(event) {
    event.preventDefault();

    // Get form data
    const Transaction_id = document.getElementById('Transaction_id').value;
    const Account_id = document.getElementById('Account_id').value;
    const Transaction_date = document.getElementById('Transaction_date').value;
    const Description = document.getElementById('Description').value;
    const Amount = document.getElementById('Amount').value;

    // Create a query string to send to the server
    const queryParams = new URLSearchParams({
        Transaction_id,
        Account_id,
        Transaction_date,
        Description,
        Amount
    });

    // Fetch the results from the server
    fetch(`http://localhost:3000/api/searchTransactions?${queryParams.toString()}`)
    .then(response => response.text())  // Use .text() to see the raw response
    .then(data => {
        console.log('Server response:', data); // Log the raw response for debugging
        try {
            const jsonData = JSON.parse(data); // Attempt to parse the response as JSON
            const tableBody = document.getElementById('transactionsTable').getElementsByTagName('tbody')[0];
            tableBody.innerHTML = ''; // Clear any existing rows
            
            jsonData.forEach(transaction => {
                const row = tableBody.insertRow();
                row.insertCell(0).textContent = transaction.Transaction_id;
                row.insertCell(1).textContent = transaction.Account_id;
                row.insertCell(2).textContent = transaction.Transaction_type;
                row.insertCell(3).textContent = transaction.Transaction_date;
                row.insertCell(4).textContent = transaction.Description;
                row.insertCell(5).textContent = transaction.Amount;
                row.insertCell(6).textContent = transaction.Balance;
                row.insertCell(7).textContent = transaction.Category;
                row.insertCell(8).textContent = transaction.Category_id;
            });
        } catch (err) {
            console.error('Error parsing JSON:', err);
        }
    })
    .catch(error => {
        console.error('Error fetching transactions:', error);
    });
});