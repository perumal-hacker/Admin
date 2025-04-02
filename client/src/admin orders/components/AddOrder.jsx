import React, { useState } from "react";
import "../styles/AdminOrders.css";

function AddOrder({ onAddOrder }) {
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
      onAddOrder({
        ...newOrder,
        orderId: addedOrder._id || "N/A",
        status: newOrder.paymentMode === "Cash on Delivery" ? "Pending" : "Successful",
        createdAt: new Date().toLocaleString(),
      });

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
      alert(error.message);
    }
  };

  return (
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
  );
}

export default AddOrder;