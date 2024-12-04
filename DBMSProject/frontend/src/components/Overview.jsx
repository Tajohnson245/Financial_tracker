import React, { useState, useEffect} from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Chart, Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip);

const Overview = () => {
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [lastMonthChartData, setLastMonthChartData] = useState(null);
  const [checkingBalance, setCheckingBalance] = useState(null);
  const [savingsBalance, setSavingsBalance] = useState(null);

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
    const fetchAccountBalance = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/accountBalance");
        if (!response.ok) {
          throw new Error("Failed to fetch recent transactions.");
        }
        const data = await response.json();
        console.log(data);
        setCheckingBalance(data[0].balance);
        setSavingsBalance(data[1].balance);
        //console.log(data);
      } catch (err) {
        console.log(err.message);
      }
    };
    fetchAccountBalance();
  }, []);

  useEffect(() => {
    const fetchLastMonthTransactions = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/lastMonthTransactions");
        if (!response.ok) {
          throw new Error("Failed to fetch last month transactions.");
        }
        const data = await response.json();
        //console.log(data);

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
    <div className="flex h-[100%] flex-row space-x-8">
      <div className="flex h-[1000px] flex-col space-y-5">
        <div className="w-[550px] h-[150px] bg-[#ffffff] font-bold text-[30px] py-3 px-6 rounded-lg mb-2">
          Checking Account: <br />
          ${checkingBalance}
        </div>
        <div className="w-[550px] h-[150px] bg-[#ffffff] font-bold text-[30px] py-3 px-6 rounded-lg mb-2">
          Savings Account: <br />
          ${savingsBalance}
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
