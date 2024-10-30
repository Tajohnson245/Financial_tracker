import React from "react";
import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="flex flex-col fixed min-h-screen top-0 left-0 w-72 bg-blue-900 p-5 ">
      <Link to="/overview">
        <div className="button bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 px-6 rounded-lg mb-2">
          Overview
        </div>
      </Link>
      <Link to="/transactions">
        <div className="button bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 px-6 rounded-lg mb-2">
          Transactions
        </div>
      </Link>
      <Link to="/goals">
        <div className="button bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 px-6 rounded-lg mb-2">
          Goals
        </div>
      </Link>
      <Link to="/trends">
        <div className="button bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 px-6 rounded-lg mb-2">
          Trends
        </div>
      </Link>
      <Link to="/test">
        <div className="button bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 px-6 rounded-lg mb-2">
          Test
        </div>
      </Link>
    </div>
  );
};

export default Sidebar;
