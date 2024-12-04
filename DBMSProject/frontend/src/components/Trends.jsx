import React, { useState, useEffect } from "react";
import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
} from "chart.js";
import "chartjs-adapter-date-fns";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
);

const Trends = () => {
  const [startDate, setStartDate] = useState(new Date(2024, 0));
  const [endDate, setEndDate] = useState(new Date(2024, 9));
  const [barStartDate, setBarStartDate] = useState(new Date(2024, 0));
  const [barEndDate, setBarEndDate] = useState(new Date(2024, 9));
  const [allTransactions, setAllTransactions] = useState([]);
  const [spendingVSIncome, setSpendingVSIncome] = useState([]);
  const [spendingCategories, setSpendingCategories] = useState([]);
  const [chartOptions, setChartOptions] = useState({
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        title: {
          display: true,
          text: "Month",
        },
        type: "time",
        time: {
          unit: "month",
        },
        min: "2024-01-01",
        max: "2024-10-01",
      },
      y: {
        title: {
          display: true,
          text: "Balance",
        },
        beginAtZero: true,
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: function (context) {
            return `$${context.raw}`;
          },
        },
      },
    },
  });
  const [barChartOptions, setBarChartOptions] = useState({
    responsive: true,
    plugins: {
      legend: {
        position: "top", // Position of the legend
      },
      title: {
        display: true,
        text: "Income vs Spending", // Chart title
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Month",
        },
        type: "time",
        time: {
          unit: "month",
        },
        min: "2024-01-01",
        max: "2024-10-01",
      },
      y: {
        beginAtZero: true, // Ensures the y-axis starts at zero
      },
    },
  });

  const formatDate = (date) => {
    return date.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  };

  // Adjust date range by moving months forward or backward
  const adjustDateRange = (direction, end) => {
    if (end == "beginning") {
      const newStartDate = new Date(
        startDate.getFullYear(),
        startDate.getMonth() + direction
      );
      setStartDate(newStartDate);
      // set new chart start date
      setChartOptions((prevOptions) => ({
        ...prevOptions,
        scales: {
          ...prevOptions.scales,
          x: {
            ...prevOptions.scales.x,
            min: `${newStartDate.getFullYear()}-${String(
              newStartDate.getMonth() + 1
            ).padStart(2, "0")}-01`,
          },
        },
      }));
    }
    if (end == "end") {
      const newEndDate = new Date(
        endDate.getFullYear(),
        endDate.getMonth() + direction
      );
      setEndDate(newEndDate);
      // set new chart end date
      setChartOptions((prevOptions) => ({
        ...prevOptions,
        scales: {
          ...prevOptions.scales,
          x: {
            ...prevOptions.scales.x,
            max: `${newEndDate.getFullYear()}-${String(
              newEndDate.getMonth() + 1
            ).padStart(2, "0")}-01`,
          },
        },
      }));
    }
  };

  // Adjust date range by moving months forward or backward
  const adjustBarChartDateRange = (direction, end) => {
    if (end == "beginning") {
      const newStartDate = new Date(
        barStartDate.getFullYear(),
        barStartDate.getMonth() + direction
      );
      setBarStartDate(newStartDate);
      // set new chart start date
      setBarChartOptions((prevOptions) => ({
        ...prevOptions,
        scales: {
          ...prevOptions.scales,
          x: {
            ...prevOptions.scales.x,
            min: `${newStartDate.getFullYear()}-${String(
              newStartDate.getMonth() + 1
            ).padStart(2, "0")}-01`,
          },
        },
      }));
    }
    if (end == "end") {
      const newEndDate = new Date(
        barEndDate.getFullYear(),
        barEndDate.getMonth() + direction
      );
      setBarEndDate(newEndDate);
      // set new chart end date
      setBarChartOptions((prevOptions) => ({
        ...prevOptions,
        scales: {
          ...prevOptions.scales,
          x: {
            ...prevOptions.scales.x,
            max: `${newEndDate.getFullYear()}-${String(
              newEndDate.getMonth() + 1
            ).padStart(2, "0")}-01`,
          },
        },
      }));
    }
  };

  useEffect(() => {
    const fetchSpendingCategories = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/api/transactionsVSLastYear"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch transactions.");
        }
        const data = await response.json();
        setSpendingCategories(data);
        console.log(data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchSpendingCategories();
  }, []);

  useEffect(() => {
    const fetchSpendingVSIncome = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/api/spendingVSIncome"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch transactions.");
        }
        const data = await response.json();
        setSpendingVSIncome(data);
        console.log(data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchSpendingVSIncome();
  }, []);

  useEffect(() => {
    const fetchAllTransactions = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/api/allTransactionsByMonth"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch transactions.");
        }
        const data = await response.json();
        setAllTransactions(data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchAllTransactions();
  }, []);

  // Prepare data for the chart
  const chartData = {
    labels: allTransactions.map((transaction) => transaction.date), // Date labels
    datasets: [
      {
        label: "Balance",
        data: allTransactions.map((transaction) => transaction.Balance), // Data for the graph
        borderColor: "rgba(75, 192, 192, 1)", // Line color
        backgroundColor: "rgba(75, 192, 192, 0.2)", // Fill color
        pointBackgroundColor: "rgba(75, 192, 192, 1)", // Point color
        fill: false, // Do not fill the area under the line
      },
    ],
  };

  const barChartData = {
    labels: spendingVSIncome.map(
      (entry) => `${entry.Year}-${String(entry.Month).padStart(2, "0")}`
    ), // Format Month and Year into "YYYY-MM"
    datasets: [
      {
        label: "Income",
        data: spendingVSIncome.map((entry) => parseFloat(entry.Income)), // Convert Income to numbers
        borderColor: "rgba(54, 162, 235, 1)", // Line color
        backgroundColor: "rgba(75, 192, 75, 1)", // Fill color
        pointBackgroundColor: "rgba(54, 162, 235, 1)", // Point color
        fill: false,
      },
      {
        label: "Spending",
        data: spendingVSIncome.map((entry) => parseFloat(-1 * entry.Spending)), // Convert Spending to numbers
        borderColor: "rgba(255, 99, 132, 1)", // Line color
        backgroundColor: "rgba(192, 75, 75, 1)", // Fill color
        pointBackgroundColor: "rgba(255, 99, 132, 1)", // Point color
        fill: false,
      },
    ],
  };

  if (spendingCategories.length ===0 ) {
    return <div>Loading data...</div>
  }

  return (
    <div className="h-[100%] font-bold text-[30px]">
      <div className="w-[100%] h-[100px] bg-white font-bold text-[30px] px-6 rounded-lg mb-2 flex items-center justify-center gap-4">
        <button
          onClick={() => adjustDateRange(-1, "beginning")}
          className="cursor-pointer bg-teal-500 text-white rounded-full w-10 h-10 flex items-center justify-center text-lg"
        >
          &lt;
        </button>
        <span>{" " + formatDate(startDate) + " "}</span>
        <button
          onClick={() => adjustDateRange(1, "beginning")}
          className="cursor-pointer bg-teal-500 text-white rounded-full w-10 h-10 flex items-center justify-center text-lg"
        >
          &gt;
        </button>
        <span> - Balance - </span>
        <button
          onClick={() => adjustDateRange(-1, "end")}
          className="cursor-pointer bg-teal-500 text-white rounded-full w-10 h-10 flex items-center justify-center text-lg"
        >
          &lt;
        </button>
        <span>{" " + formatDate(endDate) + " "}</span>
        <button
          onClick={() => adjustDateRange(1, "end")}
          className="cursor-pointer bg-teal-500 text-white rounded-full w-10 h-10 flex items-center justify-center text-lg"
        >
          &gt;
        </button>
      </div>
      <div className="w-[100%] h-[500px] bg-[#ffffff] font-bold text-[30px] px-6 rounded-lg mb-2 pt-10">
        <Line data={chartData} options={chartOptions} />
      </div>
      <div className="w-[100%] h-[100px] bg-white font-bold text-[30px] px-6 rounded-lg mb-2 flex items-center justify-center gap-4">
        <button
          onClick={() => adjustBarChartDateRange(-1, "beginning")}
          className="cursor-pointer bg-teal-500 text-white rounded-full w-10 h-10 flex items-center justify-center text-lg"
        >
          &lt;
        </button>
        <span>{" " + formatDate(barStartDate) + " "}</span>
        <button
          onClick={() => adjustBarChartDateRange(1, "beginning")}
          className="cursor-pointer bg-teal-500 text-white rounded-full w-10 h-10 flex items-center justify-center text-lg"
        >
          &gt;
        </button>
        <span> - Income vs Spending by Month - </span>
        <button
          onClick={() => adjustBarChartDateRange(-1, "end")}
          className="cursor-pointer bg-teal-500 text-white rounded-full w-10 h-10 flex items-center justify-center text-lg"
        >
          &lt;
        </button>
        <span>{" " + formatDate(barEndDate) + " "}</span>
        <button
          onClick={() => adjustBarChartDateRange(1, "end")}
          className="cursor-pointer bg-teal-500 text-white rounded-full w-10 h-10 flex items-center justify-center text-lg"
        >
          &gt;
        </button>
      </div>
      <div className="w-[100%] bg-[#ffffff] font-bold text-[30px] px-6 rounded-lg mb-2 pt-10">
        <Bar data={barChartData} options={barChartOptions} />
      </div>
      <div>
        <div className="h-[100%] bg-white font-bold text-[30px] px-6 rounded-lg mb-2 flex py-6 items-center justify-center">Compare your finances versus last year</div>
        <div className="flex flex-wrap gap-4">
          <div className="h-[250px] w-[50%] bg-white font-bold text-[25px] p-10 px-6 rounded-lg mb-2 flex py-6"> 
            <img src="https://cdn-icons-png.flaticon.com/512/1191/1191608.png"/>
            <div className="px-10 py-10">Last year you spent ${spendingCategories[1].LastYearJanToOctTotal * -1} on housing by this time,
                this year you've spent ${spendingCategories[1].CurrentYearJanToOctTotal * -1}. That's a difference of ${spendingCategories[1].Difference}
            </div>
          </div>
          <div className="h-[250px] w-[49%] bg-white font-bold text-[25px] px-6 rounded-lg mb-2 flex py-6"> 
            <div className="px-10 py-10">Last year you made ${spendingCategories[9].LastYearJanToOctTotal} by this time,
                this year you've made ${spendingCategories[9].CurrentYearJanToOctTotal}. That's a difference of ${spendingCategories[9].Difference}
            </div>
            <img src="https://cdn-icons-png.flaticon.com/512/4599/4599850.png"/>
          </div>
          <div className="h-[250px] w-[50%] bg-white font-bold text-[25px] px-6 rounded-lg mb-2 flex py-6"> 
            <img src="https://cdn-icons-png.flaticon.com/512/3225/3225194.png"/>
            <div className="px-10 py-10">Last year you spent ${spendingCategories[2].LastYearJanToOctTotal * -1} on shopping by this time,
                this year you've spent ${spendingCategories[2].CurrentYearJanToOctTotal * -1}. That's a difference of ${spendingCategories[2].Difference}
            </div>
          </div>
          <div className="h-[250px] w-[49%] bg-white font-bold text-[25px] px-6 rounded-lg mb-2 flex py-6"> 
            <div className="px-10 py-10">Last year you spent ${spendingCategories[3].LastYearJanToOctTotal * -1} on insurance by this time,
                this year you've spent ${spendingCategories[3].CurrentYearJanToOctTotal * -1}. That's a difference of ${spendingCategories[3].Difference}
            </div>
            <img src="https://cdn-icons-png.flaticon.com/512/1467/1467458.png"/>
          </div>
          <div className="h-[250px] w-[50%] bg-white font-bold text-[25px] p-10 px-6 rounded-lg mb-2 flex py-6"> 
            <img src="https://cdn-icons-png.flaticon.com/512/2025/2025457.png"/>
            <div className="px-10 py-10">Last year you spent ${spendingCategories[4].LastYearJanToOctTotal * -1} on personal care by this time,
                this year you've spent ${spendingCategories[4].CurrentYearJanToOctTotal * -1}. That's a difference of ${spendingCategories[4].Difference}
            </div>
          </div>
          <div className="h-[250px] w-[49%] bg-white font-bold text-[25px] px-6 rounded-lg mb-2 flex py-6"> 
            <div className="px-10 py-10">Last year you spent ${spendingCategories[6].LastYearJanToOctTotal * -1} on groceries by this time,
                this year you've spent ${spendingCategories[6].CurrentYearJanToOctTotal * -1}. That's a difference of ${spendingCategories[6].Difference}
            </div>
            <img src="https://cdn-icons-png.flaticon.com/512/1198/1198284.png"/>
          </div>
          <div className="h-[250px] w-[50%] bg-white font-bold text-[25px] px-6 rounded-lg mb-2 flex py-6"> 
            <img src="https://cdn-icons-png.flaticon.com/512/3321/3321601.png"/>
            <div className="px-10 py-10">Last year you spent ${spendingCategories[7].LastYearJanToOctTotal * -1} dining out by this time,
                this year you've spent ${spendingCategories[7].CurrentYearJanToOctTotal * -1}. That's a difference of ${spendingCategories[7].Difference}
            </div>
          </div>
          <div className="h-[250px] w-[49%] bg-white font-bold text-[25px] px-6 rounded-lg mb-2 flex py-6"> 
            <div className="px-10 py-10">Last year you spent ${spendingCategories[11].LastYearJanToOctTotal * -1} on utilities by this time,
                this year you've spent ${spendingCategories[11].CurrentYearJanToOctTotal * -1}. That's a difference of ${spendingCategories[11].Difference}
            </div>
            <img src="https://cdn-icons-png.flaticon.com/512/6008/6008718.png"/>
          </div>
          <div className="h-[250px] w-[50%] bg-white font-bold text-[25px] p-10 px-6 rounded-lg mb-2 flex py-6"> 
            <img src="https://cdn-icons-png.flaticon.com/512/6851/6851340.png"/>
            <div className="px-10 py-10">Last year you spent ${spendingCategories[5].LastYearJanToOctTotal * -1} on miscellaneous purchases by this time,
                this year you've spent ${spendingCategories[5].CurrentYearJanToOctTotal * -1}. That's a difference of ${spendingCategories[5].Difference}
            </div>
          </div>
          <div className="h-[250px] w-[49%] bg-white font-bold text-[25px] px-6 rounded-lg mb-2 flex py-6"> 
            <div className="px-10 py-10">Last year you spent ${spendingCategories[8].LastYearJanToOctTotal * -1} on paying off debts by this time,
                this year you've spent ${spendingCategories[8].CurrentYearJanToOctTotal * -1}. That's a difference of ${spendingCategories[8].Difference}
            </div>
            <img src="https://cdn-icons-png.flaticon.com/512/9882/9882182.png"/>
          </div>
          <div className="h-[250px] w-[50%] bg-white font-bold text-[25px] px-6 rounded-lg mb-2 flex py-6"> 
            <img src="https://cdn-icons-png.flaticon.com/512/6961/6961991.png"/>
            <div className="px-10 py-10">Last year you spent ${spendingCategories[10].LastYearJanToOctTotal * -1} on entertainment by this time,
                this year you've spent ${spendingCategories[10].CurrentYearJanToOctTotal * -1}. That's a difference of ${spendingCategories[10].Difference}
            </div>
          </div>
          <div className="h-[250px] w-[49%] bg-white font-bold text-[25px] px-6 rounded-lg mb-2 flex py-6"> 
            <div className="px-10 py-10">Last year you spent ${spendingCategories[0].LastYearJanToOctTotal * -1} on transportation by this time,
                this year you've spent ${spendingCategories[0].CurrentYearJanToOctTotal * -1}. That's a difference of ${spendingCategories[0].Difference}
            </div>
            <img src="https://cdn-icons-png.flaticon.com/512/1254/1254268.png"/>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Trends;
