import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Sidebar from "./components/Sidebar";

import Transactions from "./components/Transactions";
import "./index.css";

function App() {
  return (
    <Router>
      <div className="flex">
        <Sidebar />
        <div className="flex-1 p-5 ml-72 bg-green-200">
          <Routes>
            <Route path="/overview" element={<div>Overview Page</div>} />
            <Route
              path="/transactions"
              element={
                <>
                  <Transactions />
                </>
              }
            />
            <Route path="/goals" element={<div>Goals Page</div>} />
            <Route path="/trends" element={<div>Trends Page</div>} />
            <Route path="/test" element={<div>Test Page</div>} />
            <Route
              path="/"
              element={<div>Welcome to the Financial Tracker</div>}
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
