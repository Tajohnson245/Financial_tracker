import React, { useState, useEffect } from "react";

const Goals = () => {
  const [allGoals, setAllGoals] = useState([]);
  const [goals, setGoals] = useState([]);
  const [statusMessageSearch, setStatusMessageSearch] = useState(null);
  const [statusMessageAdd, setStatusMessageAdd] = useState(null);
  const [selectedGoals, setSelectedGoals] = useState([]);
  const [formData, setFormData] = useState({
    query: "",
  });

  const [formData2, setFormData2] = useState({
    Goal_id: "",
    Account_id: "",
    Goal_Name: "",
    Target_amount: "",
    Current_amount: "",
    Target_date: "",
    Created_at: "",
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setStatusMessageAdd(null);
      setStatusMessageSearch(null);
    }, 3000);

    return () => clearTimeout(timer);
  }, [statusMessageAdd, statusMessageSearch]);

  useEffect(() => {
    const fetchAllGoals = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/goals");
        if (!response.ok) {
          throw new Error("Failed to fetch goals.");
        }
        const data = await response.json();
        setAllGoals(data);
        setGoals(data);
      } catch (err) {
        //setError(err.message);
      }
    };
    fetchAllGoals();
  }, []);

  const searchGoalsHandleSubmit = async (e) => {
    e.preventDefault();

    const queryParams = new URLSearchParams({
      query: formData.query.trim(),
    });

    try {
      console.log(
        `http://localhost:3000/api/searchGoals?${queryParams.toString()}`
      );

      const response = await fetch(
        `http://localhost:3000/api/searchGoals?${queryParams.toString()}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch goals.");
      }
      const data = await response.json();
      console.log(data);
      setGoals(data);
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

  const addGoalHandleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3000/api/addGoal", {
        method: "POST", // Specify POST method
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData2), // Send form data as JSON in the request body
      });
      if (!response.ok) {
        throw new Error("Failed to add goal.");
      }
      const data = await response.json();
      setStatusMessageAdd({
        type: "success",
        text: "Goal added successfully.",
      });
      setFormData2({
        Goal_id: "",
        Goal_Name: "",
        Target_amount: "",
        Current_amount: "",
        Target_date: "",
        Created_at: "",
      });
    } catch (err) {
      setStatusMessageAdd({
        type: "error",
        text: err.message,
      });
    }
  };

  const deleteGoal = async () => {
    const response = await fetch(
      "http://localhost:3000/api/deleteGoals",
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ Goal_id: selectedGoals }),
      }
    );

    console.log(JSON.stringify({ Goal_id: selectedGoals }));
    console.log(response);

    if (response.ok) {
      const filteredGoals = goals.filter(
        (goals) =>
          !selectedGoals.includes(goals.Goal_id)
      );

      setGoals(filteredGoals);

      setSelectedGoals([]);

      console.log("Goals deleted successfully");
    } else {
      console.error("Error deleting goals");
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
      name === "Target_date" &&
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

  const handleSelect = (Goal_id) => {
    setSelectedGoals((prevSelected) =>
      prevSelected.includes(Goal_id)
        ? prevSelected.filter((id) => id !== Goal_id)
        : [...prevSelected, Goal_id]
    );
  };

    return(
        <div className="flex flex-col">
      <div className="flex flex-col space-y-5 mb-5">
        <form
          className="bg-white p-5 rounded-xl shadow-md w-full"
          onSubmit={addGoalHandleSubmit}
        >
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label>
                Goal ID:
                <input
                  className="border rounded p-2 block w-full mt-1"
                  type="text"
                  name="Goal_id"
                  value={formData2.Goal_id}
                  onChange={handleChange2}
                />
              </label>
            </div>
            <div>
              <label>
                Goal Name:
                <input
                  className="border rounded p-2 block w-full mt-1"
                  type="text"
                  name="Goal_name"
                  value={formData2.Goal_name}
                  onChange={handleChange2}
                />
              </label>
            </div>
            <div>
              <label>
                Target Amount:
                <input
                  className="border rounded p-2 block w-full mt-1"
                  type="text"
                  name="Target_amount"
                  value={formData2.Target_amount}
                  onChange={handleChange2}
                />
              </label>
            </div>
            <div>
              <label>
                Current Amount:
                <input
                  className="border rounded p-2 block w-full mt-1"
                  type="text"
                  name="Current_amount"
                  value={formData2.Current_amount}
                  onChange={handleChange2}
                />
              </label>
            </div>
            <div>
              <label>
                Created_at:
                <input
                  className="border rounded p-2 block w-full mt-1"
                  type="date"
                  name="Created_at"
                  value={formData2.Created_at}
                  onChange={handleChange2}
                />
              </label>
            </div>
            <div>
              <label>
                Target_date:
                <input
                  className="border rounded p-2 block w-full mt-1"
                  type="date"
                  name="Target_date"
                  value={formData2.Target_date}
                  onChange={handleChange2}
                />
              </label>
            </div>
          </div>
          <button type="submit" className="bg-teal-500 text-white p-3 mt-3">
            Add Goal
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

        <form
          className="bg-white rounded-xl p-5 w-full shadow-md"
          onSubmit={searchGoalsHandleSubmit}
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
            Search Goals
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
      </div>

      <table className="w-full border-collapse bg-white rounded-lg shadow-lg">
        <thead>
          <tr className="bg-[#22577A] text-white">
            <th className="p-2">Goal Id</th>
            <th className="p-2">Goal Name</th>
            <th className="p-2">Target Amount</th>
            <th className="p-2">Current Amount</th>
            <th className="p-2">Target Date</th>
            <th className="p-2">Created At</th>
            <th className="p-2">
              <button
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-2 rounded"
                onClick={deleteGoal}
              >
                Delete
              </button>
            </th>
          </tr>
        </thead>
        <tbody>
          {goals.length > 0 ? (
            goals.map((goal) => (
              <tr
                key={goal.Goal_id}
                className="hover:bg-[#38A3A5]"
              >
                <td className="p-2 border">{goal.Goal_id}</td>
                <td className="p-2 border">{goal.Goal_name}</td>
                <td className="p-2 border">{goal.Target_amount}</td>
                <td className="p-2 border">{goal.Current_amount}</td>
                <td className="p-2 border">{goal.Target_date}</td>
                <td className="p-2 border">{goal.Created_at}</td>
                <td className="p-2 pl-8 border">
                  <input
                    type="checkbox"
                    onChange={() => handleSelect(goal.Goal_id)}
                  />
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="9" className="text-center p-3">
                No goals found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
    )
};

export default Goals;
