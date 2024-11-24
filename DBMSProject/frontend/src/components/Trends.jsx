import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, TimeScale } from "chart.js";
import 'chartjs-adapter-date-fns';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, TimeScale);

const Trends = () => {

    const [startDate, setStartDate] = useState(new Date(2024, 0));
    const [endDate, setEndDate] = useState(new Date(2024, 9));
    const [allTransactions, setAllTransactions] = useState([]);
    const [chartOptions, setChartOptions] = useState({
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: {
                title: {
                    display: true,
                    text: "Date",
                },
                type: 'time',
                time: {
                    unit: 'month',
                },
                min: '2024-01-01',
                max: null
            },
            y: {
                title: {
                display: true,
                text: "Balance",
                },
                beginAtZero: true
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
        }
    })

    const formatDate = (date) => {
        return date.toLocaleDateString("en-US", {
            month: "short",
            year: "numeric"
        });
    };

    // Adjust date range by moving months forward or backward
    const adjustDateRange = (direction, end) => {
        if (end == "beginning"){
            const newStartDate = new Date(
                startDate.getFullYear(),
                startDate.getMonth() + direction
            );
            setStartDate(newStartDate);
            // set new chart date
            setChartOptions((prevOptions) => ({
                ...prevOptions,
                scales: {
                    ...prevOptions.scales,
                    x: {
                        ...prevOptions.scales.x,
                        min: `${newStartDate.getFullYear()}-${String(newStartDate.getMonth() + 1).padStart(2, '0')}-01`,
                    },
                },
            }));
        }
        if (end == "end"){
            const newEndDate = new Date(
                endDate.getFullYear(),
                endDate.getMonth() + direction
            );
            setEndDate(newEndDate);
        }
    }; 



    useEffect(() => {
        const fetchAllTransactions = async () => {
          try {
            const response = await fetch("http://localhost:3000/api/allTransactionsByMonth");
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
        console.log(allTransactions);
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


    return (
        <div className="h-[100%] font-bold text-[30px]">
            <div className="w-full h-[100px] bg-white font-bold text-[30px] px-6 rounded-lg mb-2 flex items-center justify-center gap-4">
            <button
                onClick={() => adjustDateRange(-1, "beginning")}
                className="cursor-pointer bg-teal-500 text-white rounded-full w-10 h-10 flex items-center justify-center text-lg"
            >
                &lt;
            </button>
            <span>
                {" " + formatDate(startDate) + " "}
            </span>
            <button
                onClick={() => adjustDateRange(1, "beginning")}
                className="cursor-pointer bg-teal-500 text-white rounded-full w-10 h-10 flex items-center justify-center text-lg"
            >
                &gt;
            </button>
            <span> - </span>
            <button
                onClick={() => adjustDateRange(-1, "end")}
                className="cursor-pointer bg-teal-500 text-white rounded-full w-10 h-10 flex items-center justify-center text-lg"
            >
                &lt;
            </button>
            <span>
                {" " + formatDate(endDate) + " "}
            </span>
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
        </div>
    );
};

export default Trends;