import React, { useState, useEffect } from "react";

const UpdateTransactions = () => {
  const [statusMessage, setStatusMessage] = useState(null);
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

  useEffect(() => {
    const timer = setTimeout(() => {
      setStatusMessage(null);
    }, 3000);

    return () => clearTimeout(timer);
  }, [statusMessage]);

  const updateTransactionsHandleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        "http://localhost:3000/api/updateTransaction",
        {
          method: "PUT", // Specify PUT method
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData), // Send form data as JSON in the request body
        }
      );
      if (!response.ok) {
        throw new Error("Failed to Update transaction.");
      }
      const data = await response.json();
      setStatusMessage({
        type: "success",
        text: "Transaction updated successfully.",
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
      setStatusMessage({
        type: "error",
        text: err.message,
      });
    }
  };

  const handleChange = (e) => {
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

      setFormData({
        ...formData,
        [name]: formattedDate,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  return (
    <>
      <form
        className="bg-white p-5 rounded-xl shadow-md w-full"
        onSubmit={updateTransactionsHandleSubmit}
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
          Update Transaction
        </button>
        {statusMessage && (
          <div
            className={
              statusMessage.type === "error" ? "text-red-500" : "text-green-500"
            }
          >
            {statusMessage.text}
          </div>
        )}
      </form>
    </>
  );
};

export default UpdateTransactions;
