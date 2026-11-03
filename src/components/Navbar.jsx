import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../auth/AuthContext";

const Navbar = () => {
  const [theme] = useState(() => localStorage.getItem("theme") || "light-theme");
  const [input, setInput] = useState("");
  const [showNoProductsMessage, setShowNoProductsMessage] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isNavCollapsed, setIsNavCollapsed] = useState(true);
  const navbarRef = useRef(null);
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const baseUrl = import.meta.env.VITE_BASE_URL;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navbarRef.current && !navbarRef.current.contains(event.target)) {
        setIsNavCollapsed(true);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  const closeNavbar = () => setIsNavCollapsed(true);

  const handleSearch = async (event) => {
    event.preventDefault();
    const keyword = input.trim();
    if (!keyword) return;

    setShowNoProductsMessage(false);
    setIsLoading(true);
    closeNavbar();
    try {
      const response = await axios.get(
        `${baseUrl}/api/product/search?keyword=${encodeURIComponent(keyword)}`
      );
      if (response.data.length === 0) {
        setShowNoProductsMessage(true);
      } else {
        navigate("/search-results", { state: { searchData: response.data } });
      }
    } catch (error) {
      console.error("Error searching products:", error);
      setShowNoProductsMessage(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    closeNavbar();
    navigate("/login", { replace: true });
  };

  return (
    <nav className="navbar navbar-expand-lg fixed-top bg-white shadow-sm" ref={navbarRef}>
      <div className="container-fluid">
        <Link className="navbar-brand d-flex align-items-center" to="/" onClick={closeNavbar}>
          <img src="/snapbuy-logo.svg" alt="SnapBuy" className="navbar-logo" />
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          onClick={() => setIsNavCollapsed((collapsed) => !collapsed)}
          aria-controls="navbarSupportedContent"
          aria-expanded={!isNavCollapsed}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div
          className={`${isNavCollapsed ? "collapse" : ""} navbar-collapse`}
          id="navbarSupportedContent"
        >
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 align-items-lg-center">
            {user?.role === "admin" ? (
              <>
                <li className="nav-item"><Link className="nav-link" to="/admin" onClick={closeNavbar}>Dashboard</Link></li>
                <li className="nav-item"><Link className="nav-link" to="/admin/add-product" onClick={closeNavbar}>Add Product</Link></li>
                <li className="nav-item"><Link className="nav-link" to="/admin/orders" onClick={closeNavbar}>All Orders</Link></li>
              </>
            ) : (
              <>
                <li className="nav-item"><Link className="nav-link" to="/" onClick={closeNavbar}>Home</Link></li>
                {user?.role === "customer" && (
                  <>
                    <li className="nav-item"><Link className="nav-link" to="/cart" onClick={closeNavbar}>Cart</Link></li>
                    <li className="nav-item"><Link className="nav-link" to="/my-orders" onClick={closeNavbar}>My Orders</Link></li>
                  </>
                )}
              </>
            )}
          </ul>

          <div className="navbar-actions d-flex flex-column flex-lg-row align-items-stretch align-items-lg-center gap-2">
            <form className="d-flex" role="search" onSubmit={handleSearch}>
              <input
                className="form-control me-2"
                type="search"
                placeholder="Search products"
                aria-label="Search products"
                value={input}
                onChange={(event) => setInput(event.target.value)}
              />
              <button className="btn btn-outline-success" type="submit" disabled={isLoading}>
                {isLoading ? "Searching…" : "Search"}
              </button>
            </form>

            {user ? (
              <div className="d-flex flex-column flex-lg-row align-items-lg-center gap-2">
                <span className="navbar-account" title={user.email}>
                  {user.role === "admin" ? "Admin" : user.email}
                </span>
                <button className="btn btn-outline-secondary btn-sm" type="button" onClick={handleLogout}>
                  Log out
                </button>
              </div>
            ) : (
              <Link className="btn btn-primary btn-sm" to="/login" onClick={closeNavbar}>Login</Link>
            )}
          </div>
        </div>

        {showNoProductsMessage && (
          <div className="alert alert-warning position-absolute mt-2 navbar-search-alert" role="status">
            No products found matching your search.
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
