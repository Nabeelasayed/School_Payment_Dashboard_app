import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import "./Dashboard.css";
const API_BASE = "http://localhost:5000";

// Enhanced Popup component
function Popup({ message, onClose }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 max-w-md w-full mx-4 transform transition-all">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-emerald-100 dark:bg-emerald-900 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Notice
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            {message}
          </p>
          <button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white py-3 px-6 rounded-lg font-semibold transition-all transform hover:scale-105 active:scale-95"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
}

function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [sort, setSort] = useState("payment_time");
  const [order, setOrder] = useState("desc");
  const [schoolId, setSchoolId] = useState("");
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const [orderId, setOrderId] = useState("");
  const [statusResult, setStatusResult] = useState("");
  const [checkingStatus, setCheckingStatus] = useState(false);

  const [popupMessage, setPopupMessage] = useState("");
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  const navigate = useNavigate();

  // Save theme in localStorage
  useEffect(() => {
    document.body.className = darkMode ? "dark" : "light";
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  // Fetch transactions
  useEffect(() => {
    async function fetchTransactions() {
      setLoading(true);
      try {
        const url = schoolId
          ? `${API_BASE}/api/transactions/school/${schoolId}?limit=${limit}&page=${page}&sort=${sort}&order=${order}`
          : `${API_BASE}/api/transactions/all-transactions?limit=${limit}&page=${page}&sort=${sort}&order=${order}`;

        const response = await axios.get(url, { withCredentials: true });
        setTransactions(response.data.transactions || []);
        setHasMore(response.data.transactions?.length === Number(limit));
        setError("");
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    fetchTransactions();
  }, [page, limit, sort, order, schoolId]);

  // Check transaction status
  async function checkStatus() {
    if (!orderId.trim()) return;
    
    setCheckingStatus(true);
    try {
      const res = await axios.get(
        `${API_BASE}/api/transactions/transaction-status/${orderId}`,
        { withCredentials: true }
      );
      setStatusResult(res.data.status);
    } catch {
      setStatusResult("Not found or error");
    } finally {
      setCheckingStatus(false);
    }
  }

  // Logout function (used in Navbar)
  async function handleLogout() {
    try {
      const res = await axios.get(`${API_BASE}/api/auth/logout`, {
        withCredentials: true,
      });
      setPopupMessage(res.data.message);
    } catch {
      setPopupMessage("Logout failed. Try again.");
    }
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20">
        <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-red-200 dark:border-red-700 max-w-md mx-4">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-2">Error</h2>
          <p className="text-gray-600 dark:text-gray-300">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`dashboard ${darkMode ? "dark" : "light"}`}>
      {/* Navbar */}
      <Navbar onLogout={handleLogout} darkMode={darkMode} setDarkMode={setDarkMode} />

      <div className="card max-w-7xl mx-auto mt-24">
        <h1 className="text-4xl font-bold mb-8 text-center">
          Transactions Dashboard
        </h1>

        {/* Transaction Status Checker */}
        <div className="status-checker">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <svg className="w-6 h-6 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Check Transaction Status
          </h2>
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Enter Custom Order ID"
              className="flex-1"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && checkStatus()}
            />
            <button
              onClick={checkStatus}
              disabled={checkingStatus || !orderId.trim()}
              className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 disabled:opacity-50 disabled:cursor-not-allowed px-6 py-2 font-semibold"
            >
              {checkingStatus ? (
                <div className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Checking...
                </div>
              ) : (
                "Check Status"
              )}
            </button>
          </div>
          {statusResult && (
            <div className="status-result">
              <p className="text-sm font-medium">
                Transaction Status:{" "}
                <span
                  className={`status-text ${
                    statusResult === "SUCCESS"
                      ? "success"
                      : statusResult === "PENDING"
                      ? "pending"
                      : "error"
                  }`}
                >
                  {statusResult}
                </span>
              </p>
            </div>
          )}
        </div>

        {/* Filters & Controls */}
        <div className="form-controls">
          <div className="controls-group">
            <div className="flex flex-col">
              <label className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Items per page</label>
              <select
                value={limit}
                onChange={(e) => {
                  setPage(1);
                  setLimit(e.target.value);
                }}
              >
                <option value={5}>5 items</option>
                <option value={10}>10 items</option>
                <option value={20}>20 items</option>
              </select>
            </div>

            <div className="flex flex-col">
              <label className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Sort by</label>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
              >
                <option value="payment_time">Payment Time</option>
                <option value="status">Status</option>
                <option value="transaction_amount">Amount</option>
              </select>
            </div>

            <div className="flex flex-col">
              <label className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Order</label>
              <select
                value={order}
                onChange={(e) => setOrder(e.target.value)}
              >
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
              </select>
            </div>

            <div className="flex flex-col">
              <label className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">School ID Filter</label>
              <input
                type="text"
                placeholder="Filter by School ID"
                value={schoolId}
                onChange={(e) => {
                  setPage(1);
                  setSchoolId(e.target.value);
                }}
              />
            </div>
          </div>

          {/* Pagination */}
          <div className="pagination">
            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Previous
            </button>
            <span>Page {page}</span>
            <button
              disabled={!hasMore}
              onClick={() => setPage(page + 1)}
            >
              Next
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="table-container">
          {loading ? (
            <div className="loading-state">
              <div className="flex items-center justify-center gap-3">
                <svg className="animate-spin h-8 w-8 text-emerald-600" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span className="text-lg font-medium">Loading transactions...</span>
              </div>
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>SR.</th>
                  <th>Custom Order ID</th>
                  <th>School ID</th>
                  <th>Gateway</th>
                  <th>Amount</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx, index) => {
                  const dateObj = tx.payment_time
                    ? new Date(tx.payment_time)
                    : null;
                  const date = dateObj ? dateObj.toLocaleDateString() : "NA";
                  const time = dateObj ? dateObj.toLocaleTimeString() : "NA";

                  return (
                    <tr key={tx.collect_id || index}>
                      <td className="font-medium">{(page - 1) * limit + index + 1}</td>
                      <td className="font-mono text-sm">{tx.collect_id || "NA"}</td>
                      <td className="font-medium">{tx.school_id || "NA"}</td>
                      <td>
                        <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs font-medium">
                          {tx.gateway || "NA"}
                        </span>
                      </td>
                      <td className="font-semibold text-emerald-600 dark:text-emerald-400">
                        ₹{tx.order_amount ?? tx.transaction_amount ?? "NA"}
                      </td>
                      <td>{date}</td>
                      <td className="text-sm text-gray-600 dark:text-gray-400">{time}</td>
                      <td>
                        <span
                          className={`status-badge ${
                            tx.status === "SUCCESS"
                              ? "success"
                              : tx.status === "PENDING"
                              ? "pending"
                              : "failed"
                          }`}
                        >
                          {tx.status === "SUCCESS" && (
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                          {tx.status === "PENDING" && (
                            <svg className="w-3 h-3 animate-spin" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                            </svg>
                          )}
                          {tx.status !== "SUCCESS" && tx.status !== "PENDING" && (
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                          )}
                          {tx.status || "NA"}
                        </span>
                      </td>
                    </tr>
                  );
                })}
                {transactions.length === 0 && !loading && (
                  <tr>
                    <td colSpan="8" className="empty-state">
                      <div className="flex flex-col items-center gap-4">
                        <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                        </svg>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-400 mb-1">No transactions found</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-500">Try adjusting your filters or check back later</p>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Popup */}
      {popupMessage && (
        <Popup
          message={popupMessage}
          onClose={() => {
            setPopupMessage("");
            navigate("/"); // back to login
          }}
        />
      )}
    </div>
  );
}

export default Dashboard;