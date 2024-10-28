import React, { useState, useEffect } from "react";

const Transactions = () => {
  const [formData, setFormData] = useState({
    Transaction_id: "",
    Transaction_type: "",
    Transaction_date: "",
    Description: "",
    Amount: "",
  });
  const [allTransactions, setAllTransactions] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState(null);

  // Fetch all transactions when the component mounts
  useEffect(() => {
    const fetchAllTransactions = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/transactions");
        if (!response.ok) {
          throw new Error("Failed to fetch transactions.");
        }
        const data = await response.json();
        setAllTransactions(data); // Store all transactions
        setTransactions(data); // Initially show all transactions in the table
      } catch (err) {
        setError(err.message);
      }
    };

    fetchAllTransactions();
  }, []);

  // Handle the form submission for searching transactions
  const handleSubmit = async (e) => {
    e.preventDefault();

    const queryParams = new URLSearchParams({
      Transaction_id: formData.Transaction_id.trim(),
      Transaction_type: formData.Transaction_type.trim(),
      Transaction_date: formData.Transaction_date.trim(),
      Description: formData.Description.trim(),
      Amount: formData.Amount.trim(),
    });

    try {
      const response = await fetch(
        `http://localhost:3000/api/searchTransactions?${queryParams.toString()}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch transactions.");
      }
      const data = await response.json();
      setTransactions(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      setTransactions(allTransactions); // Reset to all transactions on error
    }
  };

  // Handle changes in the input field
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="flex">
      <div className="bg-[#80ED99] p-5">
        <form
          className="bg-white p-5 rounded-xl shadow-md mb-5"
          onSubmit={handleSubmit}
        >
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label>
                Transaction ID:
                <input
                  className="border rounded p-2 block w-full mt-1"
                  type="text"
                  name="Transaction_id"
                  value={formData.Transaction_id}
                  onChange={handleChange}
                />
              </label>
            </div>
            <div>
              <label>
                Transaction Type:
                <input
                  className="border rounded p-2 block w-full mt-1"
                  type="text"
                  name="Transaction_type"
                  value={formData.Transaction_type}
                  onChange={handleChange}
                />
              </label>
            </div>
            <div>
              <label>
                Transaction Date:
                <input
                  className="border rounded p-2 block w-full mt-1"
                  type="date"
                  name="Transaction_date"
                  value={formData.Transaction_date}
                  onChange={handleChange}
                />
              </label>
            </div>
            <div>
              <label>
                Description:
                <input
                  className="border rounded p-2 block w-full mt-1"
                  type="text"
                  name="Description"
                  value={formData.Description}
                  onChange={handleChange}
                />
              </label>
            </div>
            <div>
              <label>
                Amount:
                <input
                  className="border rounded p-2 block w-full mt-1"
                  type="text"
                  name="Amount"
                  value={formData.Amount}
                  onChange={handleChange}
                />
              </label>
            </div>
          </div>
          <button type="submit" className="bg-teal-500 text-white p-3 mt-3">
            Search
          </button>
        </form>

        {error && <div className="text-red-500 mt-3">{error}</div>}

        <table className="w-full border-collapse bg-white rounded-lg shadow-lg">
          <thead>
            <tr className="bg-[#22577A] text-white">
              <th className="p-2">Transaction Id</th>
              <th className="p-2">Account Id</th>
              <th className="p-2">Transaction Type</th>
              <th className="p-2">Transaction Date</th>
              <th className="p-2">Description</th>
              <th className="p-2">Amount</th>
              <th className="p-2">Balance</th>
              <th className="p-2">Category</th>
              <th className="p-2">Category Id</th>
            </tr>
          </thead>
          <tbody>
            {transactions.length > 0 ? (
              transactions.map((transaction) => (
                <tr
                  key={transaction.Transaction_id}
                  className="hover:bg-[#38A3A5]"
                >
                  <td className="p-2 border">{transaction.Transaction_id}</td>
                  <td className="p-2 border">{transaction.Account_id}</td>
                  <td className="p-2 border">{transaction.Transaction_type}</td>
                  <td className="p-2 border">{transaction.Transaction_date}</td>
                  <td className="p-2 border">{transaction.Description}</td>
                  <td className="p-2 border">{transaction.Amount}</td>
                  <td className="p-2 border">{transaction.Balance}</td>
                  <td className="p-2 border">{transaction.Category}</td>
                  <td className="p-2 border">{transaction.Category_id}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="text-center p-3">
                  No transactions found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Transactions;
