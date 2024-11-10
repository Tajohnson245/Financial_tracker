import React from "react";
import { Link } from "react-router-dom";

const Overview = () => {
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
      </div>
      <div className="w-[600px] h-[700px] bg-[#ffffff] font-bold text-[30px] py-3 px-6 rounded-lg mb-2">
      Monthly Spending
      </div>
    </div>
  );
};

export default Overview;
