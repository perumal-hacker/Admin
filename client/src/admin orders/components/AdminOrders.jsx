import React, { useState } from "react";
import "../styles/AdminOrders.css";
import AddOrder from "./AddOrder";
import FetchAllOrders from "./FetchAllOrders";
import SearchByProductName from "./SearchByProductName";

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [searchResults, setSearchResults] = useState(null);

  const handleAddOrder = (newOrder) => {
    setOrders((prevOrders) => [...prevOrders, newOrder]);
    setSearchResults(null); // Reset search results when adding a new order
  };

  const handleSearchResults = (results) => {
    setSearchResults(results);
  };

  return (
    <div className="admin-orders-container">
      <h1 className="admin-title">🛠️ Admin Orders Dashboard</h1>
      <AddOrder onAddOrder={handleAddOrder} />
      <SearchByProductName onSearchResults={handleSearchResults} />
      <FetchAllOrders orders={searchResults !== null ? searchResults : orders} setOrders={setOrders} />
    </div>
  );
}

export default AdminOrders;