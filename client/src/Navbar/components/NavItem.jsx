// src/components/NavItem.jsx
import React from "react";
import { NavLink } from "react-router-dom";
import styles from "../styles/Header.module.css";

function NavItem({ label, path, onClick }) {
  return (
    <li className={styles.navItem}>
      <NavLink
        to={path}
        className={({ isActive }) => `${styles.navButton} ${isActive ? styles.navActive : ""}`}
        onClick={onClick}
      >
        {label}
      </NavLink>
    </li>
  );
}

export default NavItem;