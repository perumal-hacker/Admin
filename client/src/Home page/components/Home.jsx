// src/components/Home.jsx
import React from "react";
import { Link } from "react-router-dom";
import styles from "../styles/Home.module.css";

function Home() {
  const dashboardItems = [
    { title: "Orders", path: "/admin-orders", icon: "🛒" },
    { title: "Dealers", path: "/admin-panel", icon: "👥" },
    { title: "Meetings", path: "/admin-meeting", icon: "📅" },
    { title: "Contact", path: "/admin-contact", icon: "📞" },
    { title: "Google Meet", path: "/google-meet", icon: "🎥" },
  ];

  return (
    <div className={styles.homeContainer}>
      <h1 className={styles.homeTitle}>Admin Dashboard</h1>
      <p className={styles.homeSubtitle}>Welcome, manage your admin tasks efficiently.</p>
      <div className={styles.dashboardGrid}>
        {dashboardItems.map((item) => (
          <Link key={item.title} to={item.path} className={styles.card}>
            <span className={styles.cardIcon}>{item.icon}</span>
            <h2 className={styles.cardTitle}>{item.title}</h2>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Home;