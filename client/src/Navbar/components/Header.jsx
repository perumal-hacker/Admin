import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import NavItem from "./NavItem";
import UserSection from "./UserSection";
import styles from "../styles/Header.module.css";

const navItems = [
  { label: "Dashboard", path: "/" },
  { label: "Orders", path: "/admin-orders" },
  { label: "Dealers", path: "/admin-panel" },
  { label: "Meetings", path: "/admin-meeting" },
  { label: "Contact", path: "/admin-contact" },
  { label: "Google Meet", path: "/google-meet" },
];

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className={styles.header}>
      <NavLink to="/">
        <img
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/db90a54ff78344f1c12479e6f157c93e7f26086c418bdea53ca1c4e2c02da74b?apiKey=b7dde77ca8de46239c4205de9625fdd3&"
          alt="Company Logo"
          className={styles.logo}
        />
      </NavLink>

      <div className={styles.hamburger} onClick={() => setMenuOpen(!menuOpen)}>
        <div className={menuOpen ? `${styles.bar} ${styles.bar1} ${styles.open}` : `${styles.bar} ${styles.bar1}`} />
        <div className={menuOpen ? `${styles.bar} ${styles.bar2} ${styles.open}` : `${styles.bar} ${styles.bar2}`} />
        <div className={menuOpen ? `${styles.bar} ${styles.bar3} ${styles.open}` : `${styles.bar} ${styles.bar3}`} />
      </div>

      <nav className={`${styles.navContainer} ${menuOpen ? styles.showMenu : ""}`}>
        <ul className={styles.navMenu}>
          {navItems.map((item) => (
            <NavItem
              key={item.label}
              label={item.label}
              path={item.path}
              onClick={() => setMenuOpen(false)}
            />
          ))}
        </ul>
      </nav>

      <div className={styles.rightSection}>
        <button className={styles.notificationButton} aria-label="Notifications">
          <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/803ad92fe095182aa3abaad49a66f6a65303ffb243a912a33ace51e32039b6dd?apiKey=b7dde77ca8de46239c4205de9625fdd3&"
            alt="Notification Icon"
            className={styles.notificationIcon}
          />
        </button>

        <UserSection
          avatarSrc="https://cdn.builder.io/api/v1/image/assets/TEMP/bd3e71622679409659781f5be6b98ba64bd632f90f9de61344cb8c8824a6ecd0?apiKey=b7dde77ca8de46239c4205de9625fdd3&"
          userName="Mahendran S"
        />
      </div>
    </header>
  );
}

export default Header;