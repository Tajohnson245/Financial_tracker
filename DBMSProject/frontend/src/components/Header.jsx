import React from "react";

const Header = () => {
  return (
    <div className="flex justify-between items-center bg-blue-900 text-white p-4 shadow-md fixed w-full top-0 z-10">
      <h2 className="text-3xl font-bold">FINANCIAL TRACKER</h2>
      <div>
        <h3 className="text-2xl">BETA V0.0.1</h3>
      </div>
    </div>
  );
};

export default Header;
