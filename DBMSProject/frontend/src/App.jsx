import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Transactions from "./components/Transactions";
import Goals from "./components/Goals";
import Overview from "./components/Overview";
import Trends from "./components/Trends";

import "./index.css";

function App() {
  return (
    <Router>
      <Header />
      <div className="flex">
        <Sidebar />
        <div className="flex-1 p-5 pt-20 ml-72 bg-green-200">
          <Routes>
            <Route
              path="/overview"
              element={
                <>
                  <Overview />
                </>
              }
            />
            <Route
              path="/transactions"
              element={
                <>
                  <Transactions />
                </>
              }
            />
            <Route
              path="/goals"
              element={
                <>
                  <Goals />
                </>
              }
            />
            <Route
              path="/trends"
              element={
                <>
                  <Trends />
                </>
              }
            />
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
