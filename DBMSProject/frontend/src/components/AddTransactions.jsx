import React, { useState, useEffect } from "react";

const AddTransaction = () => {
  const [statusMessageAdd, setStatusMessageAdd] = useState(null);
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
    }, 3000);

    return () => clearTimeout(timer);
  }, [statusMessageAdd]);

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

  return (
    <>
      <form
        className="bg-white p-5 rounded-xl shadow-md w-full"
        onSubmit={addTransactionHandleSubmit}
      >
        <div className="grid grid-cols-2 gap-4">
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
    </>
  );
};

export default AddTransaction;
