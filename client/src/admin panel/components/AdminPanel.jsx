// src/components/AdminPanel.jsx
import React, { useState } from "react";
import styles from "../styles/AdminCard.module.css";

const DealerComponent = ({ dealers }) => {
  return (
    <div className={styles.dealerContainer}>
      {dealers.length > 0 ? (
        dealers.map((dealer) => (
          <div key={dealer.id} className={styles.dealerRow}>
            <p className={styles.dealerName}>{dealer.name}</p>
            <p className={styles.phoneNumber}>+91 {dealer.phone}</p>
            <p className={styles.dealerCity}>{dealer.city}</p>
            <button className={styles.pendingButton}>Move to Pending</button>
            <a href={`tel:${dealer.phone}`} className={styles.callIcon}>📞</a>
            <a href={`sms:${dealer.phone}`} className={styles.messageIcon}>💬</a>
          </div>
        ))
      ) : (
        <p className={styles.noDealers}>No dealers available</p>
      )}
    </div>
  );
};

const AdminCard = ({ product }) => {
  const [showDealers, setShowDealers] = useState(false);

  const handleDropdownClick = () => {
    setShowDealers(!showDealers);
  };

  return (
    <div>
      <div className={styles.adminCard}>
        <div className={styles.cardDetails}>
          <img src={product.image} alt={product.title} className={styles.productImage} />
          <div className={styles.adminRow1}>
            <p className={styles.productTitle}>{product.title}</p>
            <p className={styles.city}>{product.city}</p>
            <p className={styles.price}><span>${product.price}</span></p>
            <p className={styles.quantity}><span>{product.quantity}</span></p>
            <p className={styles.deliveryDate}><span>{product.date}</span></p>
            <p className={styles.deliveryTime}><span>{product.time}</span></p>
            <p className={styles.dropdownIcon} onClick={handleDropdownClick}>▼</p>
          </div>
        </div>
      </div>
      {showDealers && <DealerComponent dealers={product.dealers} />}
    </div>
  );
};

const AdminPanel = () => {
  const products = [
    {
      id: 1,
      title: "iPhone 15",
      city: "New York",
      image: "https://dummyimage.com/100x100/000/fff",
      price: 999,
      date: "26-02-2025",
      time: "10:00 AM",
      quantity: 5,
      dealers: [
        { id: 1, name: "John Doe", phone: "123-456-7890", city: "New York" },
        { id: 2, name: "Alice Smith", phone: "987-654-3210", city: "Boston" },
      ],
    },
    {
      id: 2,
      title: "Samsung Galaxy S24",
      city: "Los Angeles",
      image: "https://dummyimage.com/100x100/000/fff",
      price: 899,
      date: "26-02-2025",
      time: "2:00 PM",
      quantity: 3,
      dealers: [
        { id: 3, name: "David Brown", phone: "456-789-1234", city: "Los Angeles" },
        { id: 4, name: "Emma Wilson", phone: "321-654-9870", city: "San Francisco" },
      ],
    },
  ];

  return (
    <div className={styles.AdminBackground}>
      <div className={styles.cardTitles}>
        <p className={styles.cT1}>Image</p>
        <p className={styles.cT2}>Product Title</p>
        <p className={styles.cT3}>City</p>
        <p className={styles.cT4}>Price</p>
        <p className={styles.cT5}>Quantity</p>
        <p className={styles.cT6}>Delivery Date</p>
        <p className={styles.cT7}>Delivery Time</p>
        <p className={styles.cT8}>Dealers</p>
      </div>
      <div>
        {products.map((product) => (
          <AdminCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default AdminPanel;