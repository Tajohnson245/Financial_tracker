import React from "react";

const Header = () => {
  return (
    <div className="flex justify-between items-center bg-blue-900 text-white p-4 shadow-md fixed w-full top-0 z-10">
      <h2 className="text-2xl font-bold">FINANCIAL TRACKER</h2>
      <div>
        <button className="bg-white text-blue-900 font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:bg-blue-100 hover:shadow-lg hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50">
          Log In
        </button>
      </div>
    </div>
  );
};

export default Header;
