import React from "react";
import styles from "./Navbar.module.css";

export default function Navbar() {
  return (
    <header>
      <nav className={styles.navbar}>
        <div className={styles.logo}>AMEX Restaruant Finder</div>
        <ul className={styles.navLinks}>
          <li className={styles.navItems}>
            <a href="#">Login</a>
          </li>
          <li className={styles.navItems}>
            <a href="#">Signup</a>
          </li>
        </ul>
      </nav>
      <div className={styles.spacer}></div>
    </header>
  );
}
