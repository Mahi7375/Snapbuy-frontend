import React, { useState } from "react";
import Home from "./components/Home";
import Navbar from "./components/Navbar";
import Cart from "./components/Cart";
import AddProduct from "./components/AddProduct";
import Product from "./components/Product";
import { BrowserRouter, Routes, Route } from "react-router-dom";
// import { AppProvider } from "./Context/Context";
import UpdateProduct from "./components/UpdateProduct";
import Order from "./components/Order";
import SearchResults from "./components/SearchResults";
import Footer from "./components/Footer";
import Login from "./components/Login";
import AdminDashboard from "./components/AdminDashboard";
import MyOrders from "./components/MyOrders";
import ProtectedRoute from "./auth/ProtectedRoute";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { ToastContainer } from "react-toastify";

function App() {
  const [selectedCategory, setSelectedCategory] = useState("");

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    console.log("Selected category:", category);
  };

  // return (
  //   <AppProvider>
  //     <BrowserRouter>
  //       <ToastContainer autoClose={2000}
  //         hideProgressBar={true} />
  //       <Navbar onSelectCategory={handleCategorySelect} />
  //       <div className="min-vh-100 bg-light">
  //         <Routes>
  //           <Route
  //             path="/"
  //             element={
  //               <Home selectedCategory={selectedCategory} />
  //             }
  //           />
  //           <Route path="/add_product" element={<AddProduct />} />
  //           <Route path="/product" element={<Product />} />
  //           <Route path="/product/:id" element={<Product />} />
  //           <Route path="/cart" element={<Cart />} />
  //           <Route path="/product/update/:id" element={<UpdateProduct />} />
  //           <Route path="/orders" element={<Order />} />
  //           <Route path="/search-results" element={<SearchResults />} />
            
  //         </Routes>
  //         {/* Developer Footer */}
  //       <Footer />
  //       </div>
  //     </BrowserRouter>
  //   </AppProvider>
  // );
  return (
  <BrowserRouter>
    <ToastContainer
      autoClose={2000}
      hideProgressBar={true}
    />

    <Navbar onSelectCategory={handleCategorySelect} />

    <div className="app-shell bg-light">
      <main className="app-main">
        <Routes>
          <Route
            path="/"
            element={<Home selectedCategory={selectedCategory} />}
          />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={
            <ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>
          } />
          <Route path="/admin/add-product" element={
            <ProtectedRoute role="admin"><AddProduct /></ProtectedRoute>
          } />
          <Route path="/admin/orders" element={
            <ProtectedRoute role="admin"><Order /></ProtectedRoute>
          } />
          {/* Keep existing management URLs as admin-only aliases. */}
          <Route path="/add_product" element={
            <ProtectedRoute role="admin"><AddProduct /></ProtectedRoute>
          } />
          <Route path="/orders" element={
            <ProtectedRoute role="admin"><Order /></ProtectedRoute>
          } />
          <Route path="/product" element={<Product />} />
          <Route path="/product/update/:id" element={
            <ProtectedRoute role="admin"><UpdateProduct /></ProtectedRoute>
          } />
          <Route path="/product/:id" element={<Product />} />
          <Route path="/cart" element={
            <ProtectedRoute role="customer"><Cart /></ProtectedRoute>
          } />
          <Route path="/my-orders" element={
            <ProtectedRoute role="customer"><MyOrders /></ProtectedRoute>
          } />
          <Route path="/search-results" element={<SearchResults />} />
        </Routes>
      </main>
      <Footer />
    </div>
  </BrowserRouter>
);
}

export default App;
