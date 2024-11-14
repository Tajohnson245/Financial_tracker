import React, { useState, useEffect } from "react";
import AddTransaction from "./AddTransactions";

const Transactions = () => {
  const [allTransactions, setAllTransactions] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [statusMessageSearch, setStatusMessageSearch] = useState(null);
  const [statusMessageAdd, setStatusMessageAdd] = useState(null);
  const [selectedTransactions, setSelectedTransactions] = useState([]);
  const [formData, setFormData] = useState({
    query: "",
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setStatusMessageSearch(null);
    }, 3000);

    return () => clearTimeout(timer);
  }, [statusMessageAdd, statusMessageSearch]);

  useEffect(() => {
    const fetchAllTransactions = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/transactions");
        if (!response.ok) {
          throw new Error("Failed to fetch transactions.");
        }
        const data = await response.json();
        setAllTransactions(data);
        setTransactions(data);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchAllTransactions();
  }, []);

  const searchTransactionsHandleSubmit = async (e) => {
    e.preventDefault();

    const queryParams = new URLSearchParams({
      query: formData.query.trim(),
    });

    try {
      console.log(
        `http://localhost:3000/api/searchTransactions?${queryParams.toString()}`
      );

      const response = await fetch(
        `http://localhost:3000/api/searchTransactions?${queryParams.toString()}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch transactions.");
      }
      const data = await response.json();
      console.log(data);
      setTransactions(data);
      setStatusMessageSearch({
        type: "success",
        text: "Successful Search!",
      });
      setFormData({
        query: "",
      });
    } catch (err) {
      setStatusMessageSearch({
        type: "error",
        text: err.message,
      });
    }
  };

  const deleteTransaction = async () => {
    const response = await fetch(
      "http://localhost:3000/api/deleteTransactions",
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ Transaction_id: selectedTransactions }),
      }
    );

    console.log(JSON.stringify({ Transaction_id: selectedTransactions }));
    console.log(response);

    if (response.ok) {
      const filteredTransactions = transactions.filter(
        (transactions) =>
          !selectedTransactions.includes(transactions.Transaction_id)
      );

      setTransactions(filteredTransactions);

      setSelectedTransactions([]);

      console.log("Transactions deleted successfully");
    } else {
      console.error("Error deleting transactions");
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSelect = (Transaction_id) => {
    setSelectedTransactions((prevSelected) =>
      prevSelected.includes(Transaction_id)
        ? prevSelected.filter((id) => id !== Transaction_id)
        : [...prevSelected, Transaction_id]
    );
  };

  return (
    <div className="flex flex-col">
      <div className="flex flex-col space-y-5 mb-5">
        <form
          className="bg-white rounded-xl p-5 w-full shadow-md"
          onSubmit={searchTransactionsHandleSubmit}
        >
          <div className="flex flex-col">
            <div>
              <label>
                Search:
                <input
                  className="border rounded p-2 block w-full mt-1"
                  type="text"
                  name="query"
                  value={formData.query}
                  onChange={handleChange}
                />
              </label>
            </div>
          </div>
          <button type="submit" className="bg-teal-500 text-white p-3 mt-3">
            Search Transactions
          </button>
          {statusMessageSearch && (
            <div
              className={
                statusMessageSearch.type === "error"
                  ? "text-red-500"
                  : "text-green-500"
              }
            >
              {statusMessageSearch.text}
            </div>
          )}
        </form>
        <AddTransaction />
      </div>

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
            <th className="p-2">
              <button
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-2 rounded"
                onClick={deleteTransaction}
              >
                Delete
              </button>
            </th>
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
                <td className="p-2 pl-8 border">
                  <input
                    type="checkbox"
                    onChange={() => handleSelect(transaction.Transaction_id)}
                  />
                </td>
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
  );
};

export default Transactions;
