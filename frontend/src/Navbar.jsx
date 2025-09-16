import React from "react";
import { useNavigate } from "react-router-dom";
import { Sun, Moon } from "lucide-react";
import "./Navbar.css"; // Import the CSS file

function Navbar({ onLogout, darkMode, setDarkMode }) {
  const navigate = useNavigate();

  return (
    <nav className={`navbar ${darkMode ? "dark" : "light"}`}>
      <div className="navbar-container">
        {/* Brand/Logo */}
        <div
          className="navbar-brand"
          onClick={() => navigate("/dashboard")}
        >
          💲 School Payment Dashboard
        </div>

        {/* Navigation Links */}
        <div className="navbar-links">
          <button
            className="nav-button"
            onClick={() => navigate("/create-payment")}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Create Payment
          </button>
          
          <button
            className="nav-button"
            onClick={() => navigate("/dashboard")}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Dashboard
          </button>

          <button
            className="logout-button"
            onClick={onLogout}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>

          {/* Enhanced Dark/Light Toggle */}
          <div
            className={`theme-toggle ${darkMode ? "dark" : "light"}`}
            onClick={() => setDarkMode(!darkMode)}
            title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            <div className="toggle-icons">
              <Sun size={14} />
              <Moon size={14} />
            </div>
            <div className="toggle-thumb" />
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;