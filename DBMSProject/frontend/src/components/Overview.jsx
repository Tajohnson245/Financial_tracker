import React, { useState, useEffect} from "react";
import { Link } from "react-router-dom";

const Overview = () => {
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [lastMonthTransactions, setLastMonthTransactions] = useState([]);

  useEffect(() => {
    const fetchRecentTransactions = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/recentTransactions");
        if (!response.ok) {
          throw new Error("Failed to fetch recent transactions.");
        }
        const data = await response.json();
        setRecentTransactions(data);
        //console.log(data);
      } catch (err) {
        console.log(err.message);
      }
    };
    fetchRecentTransactions();
  }, []);

  useEffect(() => {
    const fetchLastMonthTransactions = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/lastMonthTransactions");
        if (!response.ok) {
          throw new Error("Failed to fetch last month transactions.");
        }
        const data = await response.json();
        setLastMonthTransactions(data);
        console.log(data);
      } catch (err) {
        console.log(err.message);
      }
    };
    fetchLastMonthTransactions();
  }, []);

  return (
    <div className="flex flex-row space-x-8">
      <div className="flex flex-col space-y-5">
        <div className="w-[550px] h-[150px] bg-[#ffffff] font-bold text-[30px] py-3 px-6 rounded-lg mb-2">
          Checking Account (..1234)
          $12,345.67
        </div>
        <div className="w-[550px] h-[150px] bg-[#ffffff] font-bold text-[30px] py-3 px-6 rounded-lg mb-2">
          Savings Account (..4567)
          $678.90
        </div>
        <div className="w-[550px] h-[150px] bg-[#ffffff] font-bold text-[30px] py-3 px-6 rounded-lg mb-2">
          Goal # <br></br>
          $12,345.67 / $20,000
        </div>
        <div className="w-[550px] h-[150px] bg-[#ffffff] font-bold text-[30px] py-3 px-6 rounded-lg mb-2">
          Spending this time last month
          +$1,234.56
        </div>
      </div>
      <div className="w-[600px] h-[700px] bg-[#ffffff] font-bold text-[30px] py-3 px-6 rounded-lg mb-2">
      Recent transactions
        <table>
        <tbody>
          {recentTransactions.length > 0 ? (
            recentTransactions.map((transaction) => (
              <tr
                key={transaction.Transaction_id}
                className="hover:bg-[#38A3A5]"
              >
                <td className="p-2 border text-[20px]">{transaction.date}</td>
                <td className="p-2 border text-[20px]">{transaction.Description}</td>
                <td className="p-2 border text-[20px]">{transaction.Amount}</td>
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
      <div className="w-[600px] h-[700px] bg-[#ffffff] font-bold text-[30px] py-3 px-6 rounded-lg mb-2">
      Monthly Spending
      </div>
    </div>
  );
};

export default Overview;
