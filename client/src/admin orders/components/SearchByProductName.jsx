import React, { useState } from "react";
import "../styles/AdminOrders.css";

function SearchByProductName({ onSearchResults }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setShowDetails(false);
      onSearchResults([]); // Clear results when search is empty
      return;
    }

    setLoading(true);
    setError(null);
    setShowDetails(false);
    try {
      const response = await fetch(`http://localhost:1045/products?productName=${encodeURIComponent(searchQuery)}`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const products = await response.json();
      console.log("Search results (products):", products);

      if (!products.products || !Array.isArray(products.products)) {
        setError("Invalid response format from server");
        onSearchResults([]);
        return;
      }

      const filteredProducts = products.products.filter(
        (p) => p.productName.toLowerCase() === searchQuery.trim().toLowerCase()
      );
      console.log("Filtered products:", filteredProducts);

      if (filteredProducts.length === 0) {
        setError(`No products found matching "${searchQuery}"`);
        onSearchResults([]);
        return;
      }

      const productNames = filteredProducts.map((p) => p.productName.toLowerCase());

      const ordersResponse = await fetch("http://localhost:1045/product/order");
      const ordersData = await ordersResponse.json();
      console.log("All orders from /product/order:", ordersData.orders);

      if (ordersData.orders && Array.isArray(ordersData.orders)) {
        const filteredOrders = ordersData.orders
          .filter((order) => productNames.includes(order.productName.toLowerCase()))
          .map((order) => ({
            orderId: order._id || "N/A",
            googleId: order.googleId || "Unknown",
            productName: order.productName || "Unnamed Product",
            productDescription: order.productDescription || "",
            returnPolicy: order.returnPolicy || "No policy specified",
            price: order.price || 0,
            quantity: order.quantity || 1,
            deliveryDate: order.deliveryDate ? new Date(order.deliveryDate).toISOString().split("T")[0] : "",
            deliveryTime: order.deliveryTime || "",
            deliveryType: order.deliveryType || "One Time Delivery",
            regularDeliveryDetails: order.regularDeliveryDetails || { frequency: "", days: [], dates: [] },
            deliveryMode: order.deliveryMode || "Standard",
            paymentMode: order.paymentMode || "Cash on Delivery",
            paymentFile: order.paymentFile || "",
            shippingDetails: order.shippingDetails || {
              name: "",
              phoneNumber: "",
              email: "",
              zip: "",
              city: "",
              state: "",
              landmark: "",
              address: "",
            },
            imageUrl: "https://via.placeholder.com/50",
            status: order.paymentMode === "Cash on Delivery" ? "Pending" : "Successful",
            createdAt: order.createdAt ? new Date(order.createdAt).toLocaleString() : "",
          }));
        console.log("Filtered orders:", filteredOrders);
        onSearchResults(filteredOrders);
      } else {
        onSearchResults([]);
      }
    } catch (error) {
      console.error("Error searching products:", error);
      setError(error.message);
      onSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleShowDetails = () => {
    setShowDetails(true);
  };

  return (
    <div>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by Product Name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSearch()}
        />
        <button onClick={handleSearch}>Search</button>
      </div>
      <div className="orders-table">
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="error-message">Error: {error}</p>
        ) : searchQuery.trim() && !showDetails && onSearchResults.length > 0 ? (
          <button className="order-found-button" onClick={handleShowDetails}>
            Order Found for "{searchQuery}" (Click to View Details)
          </button>
        ) : null}
      </div>
    </div>
  );
}

export default SearchByProductName;