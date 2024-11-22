import React, { useState, useEffect} from "react";
import { Link } from "react-router-dom";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Chart, Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip);

const Overview = () => {
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [lastMonthChartData, setLastMonthChartData] = useState(null);

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
        console.log(data);

        // reformat data for chart
        const labels = data.map(item => item.Category);
        const values = data.map(item => Math.abs(parseFloat(item.TotalAmount)));

        setLastMonthChartData({
          labels,
          datasets: [
            {
              label: 'Spending by Category',
              data: values,
              backgroundColor: [
                'rgba(255, 99, 132, 0.6)',
                'rgba(54, 162, 235, 0.6)',
                'rgba(255, 206, 86, 0.6)',
                'rgba(75, 192, 192, 0.6)',
                'rgba(153, 102, 255, 0.6)',
                'rgba(255, 159, 64, 0.6)',
                'rgba(199, 199, 199, 0.6)',
                'rgba(83, 102, 204, 0.6)',
                'rgba(255, 87, 51, 0.6)',
                'rgba(120, 200, 80, 0.6)',
              ],
              borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)',
                'rgba(199, 199, 199, 1)',
                'rgba(83, 102, 204, 1)',
                'rgba(255, 87, 51, 1)',
                'rgba(120, 200, 80, 1)',
              ],
              borderWidth: 1,
            },
          ],
        });
      } catch (err) {
        console.log(err.message);
      }
    };
    fetchLastMonthTransactions();
  }, []);

  return (
    <div className="flex">
      <div className="w-72 bg-[#22577A] p-5 flex flex-col items-end">
        <Link to="/">
          <div className="w-[275px] h-[75px] mb-4 bg-[#57CC99] text-white flex justify-center items-center rounded-l-full text-2xl font-bold cursor-pointer hover:bg-[#38A3A5] transition-all">
            Overview
          </div>
        </Link>
        <Link to="/transactions">
          <div className="w-[275px] h-[75px] mb-4 bg-[#38A3A5] text-white flex justify-center items-center rounded-l-full text-2xl font-bold cursor-pointer hover:bg-[#57CC99] transition-all">
            Transactions
          </div>
        </Link>
        <Link to="/goals">
          <div className="w-[275px] h-[75px] mb-4 bg-[#38A3A5] text-white flex justify-center items-center rounded-l-full text-2xl font-bold cursor-pointer hover:bg-[#57CC99] transition-all">
            Goals
          </div>
        </Link>
        <Link to="/trends">
          <div className="w-[275px] h-[75px] mb-4 bg-[#38A3A5] text-white flex justify-center items-center rounded-l-full text-2xl font-bold cursor-pointer hover:bg-[#57CC99] transition-all">
            Trends
          </div>
        </Link>
        <Link to="/test">
          <div className="w-[275px] h-[75px] mb-4 bg-[#38A3A5] text-white flex justify-center items-center rounded-l-full text-2xl font-bold cursor-pointer hover:bg-[#57CC99] transition-all">
            Test
          </div>
        </Link>
      </div>

      <div className="flex-1 bg-[#80ED99] p-5 h-screen">
        <h1 className="text-3xl font-bold">Hello</h1>
    
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
          <div>
          {lastMonthChartData ? (
        <Doughnut
          data={lastMonthChartData}
          options={{
            responsive: true,
            plugins: {
              legend: { position: 'top' },
              tooltip: { enabled: true },
            },
          }}
        />
      ) : (
        <p>Loading chart...</p>
      )}
          </div>
      </div>
    </div>
  );
};

export default Overview;
