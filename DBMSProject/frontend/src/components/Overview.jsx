import React from "react";
import { Link } from "react-router-dom";

const Overview = () => {
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
      </div>
    </div>
  );
};

export default Overview;
