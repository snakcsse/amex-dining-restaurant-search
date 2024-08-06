import React, { useContext, useState } from 'react';
import styles from './Navbar.module.css';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  const handleClick = () => {
    setShowDropdown(!showDropdown);
  };

  const logoutAndNavigate = async () => {
    await logout();
    navigate('/');
  };

  return (
    // <header>
    //   <nav className={styles.navbar}>
    //     <div className={styles.logo}>AMEX Restaruant Finder</div>
    //     <ul className={styles.navLinks}>
    //       <li className={styles.navItems}>
    //         <a href="#">Login</a>
    //       </li>
    //       <li className={styles.navItems}>
    //         <a href="#">Signup</a>
    //       </li>
    //     </ul>
    //   </nav>
    //   <div className={styles.spacer}></div>
    // </header>
    <header>
      <nav className={styles.navbar}>
        <div className={styles.logo}>
          <Link to="/">AMEX Restaruant Finder</Link>
        </div>
        <ul className={styles.navLinks}>
          {user ? (
            <>
              <li className={styles.navItems}>
                <button>
                  <Link to="/myFavourites">🤍 My favourites</Link>
                </button>
              </li>
              <li>
                <button onClick={handleClick}>🎎 ▼</button>
                {showDropdown && (
                  <ul className={styles.dropdown} onClick={handleClick}>
                    <li>
                      <button>
                        <Link to="/myAccount">My account</Link>
                      </button>
                    </li>
                    <li className={styles.navItems}>
                      <button onClick={logoutAndNavigate}>Logout</button>
                    </li>
                  </ul>
                )}
              </li>
              {/* <li className={styles.navItems}>
                <button onClick={logout}>Logout</button>
              </li> */}
            </>
          ) : (
            <>
              <li className={styles.navItems}>
                <Link to="/login">Login</Link>
              </li>
              <li className={styles.navItems}>
                <Link to="signup">Signup</Link>
              </li>
            </>
          )}
        </ul>
      </nav>
      <div className={styles.spacer}></div>
    </header>
  );
}
