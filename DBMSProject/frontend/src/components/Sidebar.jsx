import React, { useState } from "react";
import { Link } from "react-router-dom";

const Sidebar = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded((prev) => !prev);
  };

  return (
    <div className="flex flex-col fixed h-screen top-16 left-0 w-72 bg-blue-900 p-5 pb-20">
      {/* Navigation Links and Expandable Box */}
      <div>
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

        <div
          className={`${
            isExpanded ? "h-96" : "h-10"
          } bg-teal-300 pt-2 rounded-lg transition-all duration-300 my-4 flex flex-col justify-between`}
          onClick={toggleExpand}
        >
          {/* Main Button Text */}
          <button className="w-full text-center text-blue-900 font-semibold">
            {isExpanded ? "Adding Transactions" : "Adding Transactions"}
          </button>

          {isExpanded && (
            <ul className="pl-8 list-disc text-teal-800 text-sm">
              <li>
                <b>Year</b>: Enter the 4-digit year, e.g., "2023".
              </li>
              <li>
                <b>Month</b>: Enter the 2-digit month, e.g., "01" for January,
                "12" for December.
              </li>
              <li>
                <b>Day</b>: Enter the 2-digit day of the month, e.g., "02" for
                the 2nd, "31" for the last day.
              </li>
              <li>
                <b>Month Abbreviation</b>: Use the first 3 letters of the month
                in uppercase, e.g., "JAN" for January, "MAR" for March.
              </li>
              <li>
                <b>Amount Code</b>: Represent the amount without decimals or
                commas. For example, $30.01 becomes "3001".
              </li>
            </ul>
          )}

          {/* Close Text at Bottom */}
          {isExpanded && (
            <button className="text-center text-blue-900 font-semibold mb-2">
              Close
            </button>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="text-left text-white mt-auto">
        <p className="text-lg">© 2024 Financial Tracker</p>
        <p className="text-lg">All rights reserved.</p>
      </div>
    </div>
  );
};

export default Sidebar;
