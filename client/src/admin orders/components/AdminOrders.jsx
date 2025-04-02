import React, { useState, useEffect } from "react";
import "../styles/AdminOrders.css";
import callIcon from "../assets/call-icon.jpg";
import messageIcon from "../assets/message-icon.jpg";

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [editingOrderId, setEditingOrderId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newOrder, setNewOrder] = useState({
    googleId: "",
    productDescription: "",
    productName: "",
    returnPolicy: "",
    price: 0,
    quantity: 1,
    deliveryDate: "",
    deliveryTime: "",
    deliveryType: "One Time Delivery",
    regularDeliveryDetails: { frequency: "", days: [], dates: [] },
    deliveryMode: "Standard",
    paymentMode: "Cash on Delivery",
    paymentFile: "",
    shippingDetails: {
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
  });

  // Fetch all orders on mount
  useEffect(() => {
    const fetchAllOrders = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch("http://localhost:1045/product/order");
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        console.log("Raw API response:", data);

        if (!data.orders || !Array.isArray(data.orders)) {
          setOrders([]);
          setError(data.message || "No valid orders data found");
          return;
        }

        const mappedOrders = data.orders.map((order) => {
          console.log("Individual order:", order);
          return {
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
          };
        });

        setOrders(mappedOrders);
      } catch (error) {
        console.error("Error fetching orders:", error);
        setError(error.message);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAllOrders();
  }, []);

  const handleEdit = (orderId) => {
    console.log("Editing order:", orderId);
    setEditingOrderId(orderId);
  };

  const handleSave = async (orderId) => {
    const orderToUpdate = orders.find((o) => o.orderId === orderId);
    try {
      const response = await fetch(`http://localhost:1045/product/orders/${orderId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          googleId: orderToUpdate.googleId,
          productDescription: orderToUpdate.productDescription,
          productName: orderToUpdate.productName,
          returnPolicy: orderToUpdate.returnPolicy,
          price: orderToUpdate.price,
          quantity: orderToUpdate.quantity,
          deliveryDate: orderToUpdate.deliveryDate,
          deliveryTime: orderToUpdate.deliveryTime,
          deliveryType: orderToUpdate.deliveryType,
          regularDeliveryDetails: orderToUpdate.deliveryType === "Regular Delivery" ? orderToUpdate.regularDeliveryDetails : undefined,
          deliveryMode: orderToUpdate.deliveryMode,
          paymentMode: orderToUpdate.paymentMode,
          paymentFile: orderToUpdate.paymentMode === "Online Payment" ? orderToUpdate.paymentFile : undefined,
          shippingDetails: orderToUpdate.shippingDetails,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to update order: ${response.statusText}`);
      }

      const updatedOrder = await response.json();
      setOrders((prevOrders) =>
        prevOrders.map((o) => (o.orderId === orderId ? { ...o, ...updatedOrder } : o))
      );
      setEditingOrderId(null);
      console.log(`Order ${orderId} updated successfully`);
    } catch (error) {
      console.error("Error saving order:", error);
      setError(error.message);
    }
  };

  const handleChange = (orderId, field, value, nestedField) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.orderId === orderId
          ? nestedField
            ? { ...order, [field]: { ...order[field], [nestedField]: value } }
            : { ...order, [field]: value }
          : order
      )
    );
  };

  const handleDelete = async (orderId) => {
    console.log("Attempting to delete order with ID:", orderId);
    if (orderId === "N/A") {
      setError("Cannot delete order with invalid ID");
      return;
    }
    if (window.confirm("Are you sure you want to delete this order?")) {
      try {
        const response = await fetch(`http://localhost:1045/product/orders/${orderId}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error(`Failed to delete order: ${response.statusText}`);
        }

        setOrders((prevOrders) => prevOrders.filter((o) => o.orderId !== orderId));
        console.log(`Order ${orderId} deleted successfully`);
      } catch (error) {
        console.error("Error deleting order:", error);
        setError(error.message);
      }
    }
  };

  const handleAddOrder = async () => {
    if (!newOrder.googleId || !newOrder.productName || !newOrder.deliveryDate || !newOrder.deliveryTime) {
      alert("Google ID, Product Name, Delivery Date, and Delivery Time are required!");
      return;
    }

    try {
      const response = await fetch(`http://localhost:1045/product/${newOrder.googleId}/${newOrder.productName}/order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          googleId: newOrder.googleId,
          productDescription: newOrder.productDescription,
          returnPolicy: newOrder.returnPolicy,
          price: newOrder.price,
          quantity: newOrder.quantity,
          deliveryDate: newOrder.deliveryDate,
          deliveryTime: newOrder.deliveryTime,
          deliveryType: newOrder.deliveryType,
          regularDeliveryDetails: newOrder.deliveryType === "Regular Delivery" ? newOrder.regularDeliveryDetails : undefined,
          deliveryMode: newOrder.deliveryMode,
          paymentMode: newOrder.paymentMode,
          paymentFile: newOrder.paymentMode === "Online Payment" ? newOrder.paymentFile : undefined,
          shippingDetails: newOrder.shippingDetails,
          productName: newOrder.productName,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to add order: ${response.statusText}`);
      }

      const addedOrder = await response.json();
      setOrders((prevOrders) => [
        ...prevOrders,
        {
          ...newOrder,
          orderId: addedOrder._id || "N/A",
          status: newOrder.paymentMode === "Cash on Delivery" ? "Pending" : "Successful",
          createdAt: new Date().toLocaleString(),
        },
      ]);

      setNewOrder({
        googleId: "",
        productDescription: "",
        returnPolicy: "",
        price: 0,
        quantity: 1,
        deliveryDate: "",
        deliveryTime: "",
        deliveryType: "One Time Delivery",
        regularDeliveryDetails: { frequency: "", days: [], dates: [] },
        deliveryMode: "Standard",
        paymentMode: "Cash on Delivery",
        paymentFile: "",
        shippingDetails: {
          name: "",
          phoneNumber: "",
          email: "",
          zip: "",
          city: "",
          state: "",
          landmark: "",
          address: "",
        },
        productName: "",
        imageUrl: "https://via.placeholder.com/50",
      });
    } catch (error) {
      console.error("Error adding order:", error);
      setError(error.message);
    }
  };

  return (
    <div className="admin-orders-container">
      <h1 className="admin-title">🛠️ Admin Orders Dashboard</h1>

      {/* Add New Order Form */}
      <div className="add-order-form">
        <h2>Add New Order</h2>
        <div className="form-row">
          <input
            type="text"
            placeholder="Google ID"
            value={newOrder.googleId}
            onChange={(e) => setNewOrder({ ...newOrder, googleId: e.target.value })}
          />
          <input
            type="text"
            placeholder="Product Name"
            value={newOrder.productName}
            onChange={(e) => setNewOrder({ ...newOrder, productName: e.target.value })}
          />
          <input
            type="text"
            placeholder="Product Description"
            value={newOrder.productDescription}
            onChange={(e) => setNewOrder({ ...newOrder, productDescription: e.target.value })}
          />
          <input
            type="text"
            placeholder="Return Policy"
            value={newOrder.returnPolicy}
            onChange={(e) => setNewOrder({ ...newOrder, returnPolicy: e.target.value })}
          />
          <input
            type="number"
            placeholder="Price"
            value={newOrder.price}
            onChange={(e) => setNewOrder({ ...newOrder, price: Number(e.target.value) })}
          />
          <input
            type="number"
            placeholder="Quantity"
            value={newOrder.quantity}
            onChange={(e) => setNewOrder({ ...newOrder, quantity: Number(e.target.value) })}
          />
          <input
            type="date"
            placeholder="Delivery Date"
            value={newOrder.deliveryDate}
            onChange={(e) => setNewOrder({ ...newOrder, deliveryDate: e.target.value })}
          />
          <input
            type="text"
            placeholder="Delivery Time"
            value={newOrder.deliveryTime}
            onChange={(e) => setNewOrder({ ...newOrder, deliveryTime: e.target.value })}
          />
          <select
            value={newOrder.deliveryType}
            onChange={(e) => setNewOrder({ ...newOrder, deliveryType: e.target.value })}
          >
            <option value="One Time Delivery">One Time Delivery</option>
            <option value="Regular Delivery">Regular Delivery</option>
          </select>
          {newOrder.deliveryType === "Regular Delivery" && (
            <>
              <input
                type="text"
                placeholder="Frequency"
                value={newOrder.regularDeliveryDetails.frequency}
                onChange={(e) =>
                  setNewOrder({
                    ...newOrder,
                    regularDeliveryDetails: { ...newOrder.regularDeliveryDetails, frequency: e.target.value },
                  })
                }
              />
              <input
                type="text"
                placeholder="Dates (comma-separated)"
                value={newOrder.regularDeliveryDetails.dates.join(",")}
                onChange={(e) =>
                  setNewOrder({
                    ...newOrder,
                    regularDeliveryDetails: {
                      ...newOrder.regularDeliveryDetails,
                      dates: e.target.value.split(",").map(Number),
                    },
                  })
                }
              />
            </>
          )}
          <input
            type="text"
            placeholder="Delivery Mode"
            value={newOrder.deliveryMode}
            onChange={(e) => setNewOrder({ ...newOrder, deliveryMode: e.target.value })}
          />
          <select
            value={newOrder.paymentMode}
            onChange={(e) => setNewOrder({ ...newOrder, paymentMode: e.target.value })}
          >
            <option value="Cash on Delivery">Cash on Delivery</option>
            <option value="Online Payment">Online Payment</option>
          </select>
          {newOrder.paymentMode === "Online Payment" && (
            <input
              type="text"
              placeholder="Payment File URL"
              value={newOrder.paymentFile}
              onChange={(e) => setNewOrder({ ...newOrder, paymentFile: e.target.value })}
            />
          )}
          <input
            type="text"
            placeholder="Shipping Name"
            value={newOrder.shippingDetails.name}
            onChange={(e) =>
              setNewOrder({
                ...newOrder,
                shippingDetails: { ...newOrder.shippingDetails, name: e.target.value },
              })
            }
          />
          <input
            type="text"
            placeholder="Phone Number"
            value={newOrder.shippingDetails.phoneNumber}
            onChange={(e) =>
              setNewOrder({
                ...newOrder,
                shippingDetails: { ...newOrder.shippingDetails, phoneNumber: e.target.value },
              })
            }
          />
          <input
            type="text"
            placeholder="Email"
            value={newOrder.shippingDetails.email}
            onChange={(e) =>
              setNewOrder({
                ...newOrder,
                shippingDetails: { ...newOrder.shippingDetails, email: e.target.value },
              })
            }
          />
          <input
            type="text"
            placeholder="Zip"
            value={newOrder.shippingDetails.zip}
            onChange={(e) =>
              setNewOrder({
                ...newOrder,
                shippingDetails: { ...newOrder.shippingDetails, zip: e.target.value },
              })
            }
          />
          <input
            type="text"
            placeholder="City"
            value={newOrder.shippingDetails.city}
            onChange={(e) =>
              setNewOrder({
                ...newOrder,
                shippingDetails: { ...newOrder.shippingDetails, city: e.target.value },
              })
            }
          />
          <input
            type="text"
            placeholder="State"
            value={newOrder.shippingDetails.state}
            onChange={(e) =>
              setNewOrder({
                ...newOrder,
                shippingDetails: { ...newOrder.shippingDetails, state: e.target.value },
              })
            }
          />
          <input
            type="text"
            placeholder="Landmark"
            value={newOrder.shippingDetails.landmark}
            onChange={(e) =>
              setNewOrder({
                ...newOrder,
                shippingDetails: { ...newOrder.shippingDetails, landmark: e.target.value },
              })
            }
          />
          <input
            type="text"
            placeholder="Address"
            value={newOrder.shippingDetails.address}
            onChange={(e) =>
              setNewOrder({
                ...newOrder,
                shippingDetails: { ...newOrder.shippingDetails, address: e.target.value },
              })
            }
          />
          <button className="add-button" onClick={handleAddOrder}>
            Add Order
          </button>
        </div>
      </div>

      {/* Orders Table */}
      <div className="orders-table">
        {loading ? (
          <p>Loading orders...</p>
        ) : error ? (
          <p className="error-message">Error: {error}</p>
        ) : orders.length === 0 ? (
          <p className="no-orders">No orders available.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>S.No</th>
                <th>Image</th>
                <th>Order Info</th>
                <th>Price</th>
                <th>Pickup</th>
                <th>Delivery</th>
                <th>Payment</th>
                <th>Shipping</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, index) => (
                <tr key={order.orderId}>
                  <td>{index + 1}</td>
                  <td>
                    <img src={order.imageUrl} alt="Product" className="order-image" />
                  </td>
                  <td className={`order-info ${loading ? "loading" : error ? "error" : ""}`}>
                    {editingOrderId === order.orderId ? (
                      <>
                        <input
                          type="text"
                          value={order.googleId}
                          onChange={(e) => handleChange(order.orderId, "googleId", e.target.value)}
                        />
                        <input
                          type="text"
                          value={order.productName}
                          onChange={(e) => handleChange(order.orderId, "productName", e.target.value)}
                        />
                        <input
                          type="text"
                          value={order.productDescription}
                          onChange={(e) => handleChange(order.orderId, "productDescription", e.target.value)}
                        />
                        <input
                          type="text"
                          value={order.returnPolicy}
                          onChange={(e) => handleChange(order.orderId, "returnPolicy", e.target.value)}
                        />
                        <input
                          type="number"
                          value={order.quantity}
                          onChange={(e) => handleChange(order.orderId, "quantity", Number(e.target.value))}
                        />
                      </>
                    ) : (
                      <>
                        <p>
                          <strong>Order ID:</strong> {order.orderId}
                        </p>
                        <p>
                          <strong>Google ID:</strong> {order.googleId}
                        </p>
                        <p>
                          <strong>Product:</strong> {order.productName}
                        </p>
                        <p>
                          <strong>Description:</strong> {order.productDescription}
                        </p>
                        <p>
                          <strong>Return Policy:</strong> {order.returnPolicy}
                        </p>
                        <p>
                          <strong>Quantity:</strong> {order.quantity}
                        </p>
                      </>
                    )}
                  </td>
                  <td>
                    {editingOrderId === order.orderId ? (
                      <input
                        type="number"
                        value={order.price}
                        onChange={(e) => handleChange(order.orderId, "price", Number(e.target.value))}
                      />
                    ) : (
                      <b>${order.price}</b>
                    )}
                  </td>
                  <td>
                    {editingOrderId === order.orderId ? (
                      <input
                        type="text"
                        value={order.deliveryMode}
                        onChange={(e) => handleChange(order.orderId, "deliveryMode", e.target.value)}
                      />
                    ) : (
                      <p>{order.deliveryMode}</p>
                    )}
                  </td>
                  <td>
                    {editingOrderId === order.orderId ? (
                      <>
                        <input
                          type="date"
                          value={order.deliveryDate}
                          onChange={(e) => handleChange(order.orderId, "deliveryDate", e.target.value)}
                        />
                        <input
                          type="text"
                          value={order.deliveryTime}
                          onChange={(e) => handleChange(order.orderId, "deliveryTime", e.target.value)}
                        />
                        <select
                          value={order.deliveryType}
                          onChange={(e) => handleChange(order.orderId, "deliveryType", e.target.value)}
                        >
                          <option value="One Time Delivery">One Time Delivery</option>
                          <option value="Regular Delivery">Regular Delivery</option>
                        </select>
                        {order.deliveryType === "Regular Delivery" && (
                          <>
                            <input
                              type="text"
                              value={order.regularDeliveryDetails.frequency}
                              onChange={(e) =>
                                handleChange(order.orderId, "regularDeliveryDetails", e.target.value, "frequency")
                              }
                            />
                            <input
                              type="text"
                              value={order.regularDeliveryDetails.dates.join(",")}
                              onChange={(e) =>
                                handleChange(
                                  order.orderId,
                                  "regularDeliveryDetails",
                                  e.target.value.split(",").map(Number),
                                  "dates"
                                )
                              }
                            />
                          </>
                        )}
                        <select
                          value={order.status}
                          onChange={(e) => handleChange(order.orderId, "status", e.target.value)}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Successful">Successful</option>
                          <option value="Missed">Missed</option>
                        </select>
                      </>
                    ) : (
                      <>
                        <p>
                          <b>Date:</b> {order.deliveryDate}
                        </p>
                        <p>
                          <b>Time:</b> {order.deliveryTime}
                        </p>
                        <p>
                          <b>Type:</b> {order.deliveryType}
                        </p>
                        {order.deliveryType === "Regular Delivery" && (
                          <>
                            <p>
                              <b>Frequency:</b> {order.regularDeliveryDetails.frequency}
                            </p>
                            <p>
                              <b>Dates:</b> {order.regularDeliveryDetails.dates.join(", ")}
                            </p>
                          </>
                        )}
                        <div className={`order-status ${order.status.toLowerCase()}`}>{order.status}</div>
                      </>
                    )}
                  </td>
                  <td>
                    {editingOrderId === order.orderId ? (
                      <>
                        <select
                          value={order.paymentMode}
                          onChange={(e) => handleChange(order.orderId, "paymentMode", e.target.value)}
                        >
                          <option value="Cash on Delivery">Cash on Delivery</option>
                          <option value="Online Payment">Online Payment</option>
                        </select>
                        {order.paymentMode === "Online Payment" && (
                          <input
                            type="text"
                            value={order.paymentFile}
                            onChange={(e) => handleChange(order.orderId, "paymentFile", e.target.value)}
                          />
                        )}
                      </>
                    ) : (
                      <>
                        <p>
                          <b>Mode:</b> {order.paymentMode}
                        </p>
                        {order.paymentMode === "Online Payment" && <p>File: {order.paymentFile}</p>}
                      </>
                    )}
                  </td>
                  <td>
                    {editingOrderId === order.orderId ? (
                      <>
                        <input
                          type="text"
                          value={order.shippingDetails.name}
                          onChange={(e) => handleChange(order.orderId, "shippingDetails", e.target.value, "name")}
                        />
                        <input
                          type="text"
                          value={order.shippingDetails.phoneNumber}
                          onChange={(e) =>
                            handleChange(order.orderId, "shippingDetails", e.target.value, "phoneNumber")
                          }
                        />
                        <input
                          type="text"
                          value={order.shippingDetails.email}
                          onChange={(e) => handleChange(order.orderId, "shippingDetails", e.target.value, "email")}
                        />
                        <input
                          type="text"
                          value={order.shippingDetails.zip}
                          onChange={(e) => handleChange(order.orderId, "shippingDetails", e.target.value, "zip")}
                        />
                        <input
                          type="text"
                          value={order.shippingDetails.city}
                          onChange={(e) => handleChange(order.orderId, "shippingDetails", e.target.value, "city")}
                        />
                        <input
                          type="text"
                          value={order.shippingDetails.state}
                          onChange={(e) => handleChange(order.orderId, "shippingDetails", e.target.value, "state")}
                        />
                        <input
                          type="text"
                          value={order.shippingDetails.landmark}
                          onChange={(e) => handleChange(order.orderId, "shippingDetails", e.target.value, "landmark")}
                        />
                        <input
                          type="text"
                          value={order.shippingDetails.address}
                          onChange={(e) => handleChange(order.orderId, "shippingDetails", e.target.value, "address")}
                        />
                      </>
                    ) : (
                      <>
                        <p>
                          <b>Name:</b> {order.shippingDetails.name}
                        </p>
                        <p>
                          <b>Phone:</b> {order.shippingDetails.phoneNumber}
                        </p>
                        <p>
                          <b>Email:</b> {order.shippingDetails.email}
                        </p>
                        <p>
                          <b>Zip:</b> {order.shippingDetails.zip}
                        </p>
                        <p>
                          <b>City:</b> {order.shippingDetails.city}
                        </p>
                        <p>
                          <b>State:</b> {order.shippingDetails.state}
                        </p>
                        <p>
                          <b>Landmark:</b> {order.shippingDetails.landmark}
                        </p>
                        <p>
                          <b>Address:</b> {order.shippingDetails.address}
                        </p>
                      </>
                    )}
                  </td>
                  <td>
                    <div className="admin-actions">
                      {editingOrderId === order.orderId ? (
                        <button className="save-button" onClick={() => handleSave(order.orderId)}>
                          Save
                        </button>
                      ) : (
                        <button className="edit-button" onClick={() => handleEdit(order.orderId)}>
                          Edit
                        </button>
                      )}
                      <button className="delete-button" onClick={() => handleDelete(order.orderId)}>
                        Delete
                      </button>
                      <button className="call-button">
                        <img src={callIcon} alt="Call" className="icon-button" />
                      </button>
                      <button className="message-button">
                        <img src={messageIcon} alt="Message" className="icon-button" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default AdminOrders;