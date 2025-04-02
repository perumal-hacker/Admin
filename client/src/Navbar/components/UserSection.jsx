// src/components/UserSection.jsx
import React from "react";
import styles from "../styles/Header.module.css";

function UserSection({ avatarSrc, userName }) {
  return (
    <div className={styles.userSection}>
      <img src={avatarSrc} alt="User Avatar" className={styles.userAvatar} />
      <span className={styles.userName}>{userName}</span>
    </div>
  );
}

export default UserSection;