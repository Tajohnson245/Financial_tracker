import React, { useState, useEffect } from "react";

const Transactions = () => {
  const [allTransactions, setAllTransactions] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [statusMessageSearch, setStatusMessageSearch] = useState(null);
  const [statusMessageAdd, setStatusMessageAdd] = useState(null);
  const [selectedTransactions, setSelectedTransactions] = useState([]);
  const [formData, setFormData] = useState({
    Transaction_id: "",
    Account_id: "",
    Transaction_type: "",
    Transaction_date: "",
    Description: "",
    Amount: "",
    Balance: "",
    Category: "",
    Category_id: "",
  });

  const [formData2, setFormData2] = useState({
    Transaction_id: "",
    Account_id: "",
    Transaction_type: "",
    Transaction_date: "",
    Description: "",
    Amount: "",
    Balance: "",
    Category: "",
    Category_id: "",
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setStatusMessageAdd(null);
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
      Transaction_id: formData.Transaction_id.trim(),
      Account_id: formData.Account_id.trim(),
      Transaction_type: formData.Transaction_type.trim(),
      Transaction_date: formData.Transaction_date.trim(),
      Description: formData.Description.trim(),
      Amount: formData.Amount.trim(),
      Balance: formData.Balance.trim(),
      Category: formData.Category.trim(),
      Category_id: formData.Category_id.trim(),
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
      setStatusMessageSearch({
        type: "success",
        text: "Successful Search!",
      });
      setFormData({
        Transaction_id: "",
        Account_id: "",
        Transaction_type: "",
        Transaction_date: "",
        Description: "",
        Amount: "",
        Balance: "",
        Category: "",
        Category_id: "",
      });
    } catch (err) {
      setStatusMessageSearch({
        type: "error",
        text: err.message,
      });
    }
  };

  const addTransactionHandleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3000/api/addTransaction", {
        method: "POST", // Specify POST method
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData2), // Send form data as JSON in the request body
      });
      if (!response.ok) {
        throw new Error("Failed to add transaction.");
      }
      const data = await response.json();
      setStatusMessageAdd({
        type: "success",
        text: "Transaction added successfully.",
      });
      setFormData2({
        Transaction_id: "",
        Account_id: "",
        Transaction_type: "",
        Transaction_date: "",
        Description: "",
        Amount: "",
        Balance: "",
        Category: "",
        Category_id: "",
      });
    } catch (err) {
      setStatusMessageAdd({
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

  const handleChange2 = (e) => {
    const { name, value } = e.target;

    if (
      name === "Transaction_date" &&
      value &&
      /^\d{2}\/\d{2}\/\d{4}$/.test(value)
    ) {
      const [month, day, year] = value.split("/");

      const formattedDate = `${year}-${month.padStart(2, "0")}-${day.padStart(
        2,
        "0"
      )}`;

      setFormData2({
        ...formData2,
        [name]: formattedDate,
      });
    } else {
      setFormData2({
        ...formData2,
        [name]: value,
      });
    }
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
      <div className="flex space-x-5 mb-5">
        <form
          className="bg-white p-5 rounded-xl shadow-md w-1/2"
          onSubmit={searchTransactionsHandleSubmit}
        >
          <div className="flex flex-col">
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
                Account ID:
                <input
                  className="border rounded p-2 block w-full mt-1"
                  type="text"
                  name="Account_id"
                  value={formData.Account_id}
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
            <div>
              <label>
                Balance:
                <input
                  className="border rounded p-2 block w-full mt-1"
                  type="text"
                  name="Balance"
                  value={formData.Balance}
                  onChange={handleChange}
                />
              </label>
            </div>
            <div>
              <label>
                Category:
                <input
                  className="border rounded p-2 block w-full mt-1"
                  type="text"
                  name="Category"
                  value={formData.Category}
                  onChange={handleChange}
                />
              </label>
            </div>
            <div>
              <label>
                Category ID:
                <input
                  className="border rounded p-2 block w-full mt-1"
                  type="text"
                  name="Category_id"
                  value={formData.Category_id}
                  onChange={handleChange}
                />
              </label>
            </div>
          </div>
          <button type="submit" className="bg-teal-500 text-white p-3 mt-3">
            Search Transaction
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

        <form
          className="bg-white p-5 rounded-xl shadow-md w-1/2"
          onSubmit={addTransactionHandleSubmit}
        >
          <div className="flex flex-col">
            <div>
              <label>
                Transaction ID:
                <input
                  className="border rounded p-2 block w-full mt-1"
                  type="text"
                  name="Transaction_id"
                  value={formData2.Transaction_id}
                  onChange={handleChange2}
                />
              </label>
            </div>
            <div>
              <label>
                Account ID:
                <input
                  className="border rounded p-2 block w-full mt-1"
                  type="text"
                  name="Account_id"
                  value={formData2.Account_id}
                  onChange={handleChange2}
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
                  value={formData2.Transaction_type}
                  onChange={handleChange2}
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
                  value={formData2.Transaction_date}
                  onChange={handleChange2}
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
                  value={formData2.Description}
                  onChange={handleChange2}
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
                  value={formData2.Amount}
                  onChange={handleChange2}
                />
              </label>
            </div>
            <div>
              <label>
                Balance:
                <input
                  className="border rounded p-2 block w-full mt-1"
                  type="text"
                  name="Balance"
                  value={formData2.Balance}
                  onChange={handleChange2}
                />
              </label>
            </div>
            <div>
              <label>
                Category:
                <input
                  className="border rounded p-2 block w-full mt-1"
                  type="text"
                  name="Category"
                  value={formData2.Category}
                  onChange={handleChange2}
                />
              </label>
            </div>
            <div>
              <label>
                Category ID:
                <input
                  className="border rounded p-2 block w-full mt-1"
                  type="text"
                  name="Category_id"
                  value={formData2.Category_id}
                  onChange={handleChange2}
                />
              </label>
            </div>
          </div>
          <button type="submit" className="bg-teal-500 text-white p-3 mt-3">
            Add Transaction
          </button>
          {statusMessageAdd && (
            <div
              className={
                statusMessageAdd.type === "error"
                  ? "text-red-500"
                  : "text-green-500"
              }
            >
              {statusMessageAdd.text}
            </div>
          )}
        </form>
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
