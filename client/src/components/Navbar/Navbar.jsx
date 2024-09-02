import { useContext, useState } from 'react';
import styles from './Navbar.module.css';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function Navbar() {
  const { user, logout, showUserNavItems } = useContext(AuthContext);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  const handleClick = () => {
    setShowDropdown(!showDropdown);
  };

  const logoutAndNavigate = async () => {
    await logout();
    localStorage.removeItem('showUserNavItems');
    navigate('/');
  };

  return (
    <header>
      <nav className={styles.navbar}>
        <div className={styles.logoContainer}>
          <img className={styles.logo} src="/img/amexDineLogo.png" alt="Amex Dining Finder Logo" />
          <div className={styles.logoText}>
            <Link to="/">AMEX Dining Restaruant Finder</Link>
          </div>
        </div>
        <ul className={styles.navLinks}>
          {user && localStorage.getItem('showUserNavItems') ? (
            <>
              <li className={styles.navItems}>
                <Link to="/myFavourites">
                  <span className={styles.navItemsHeart}>🤍</span>
                  <span className={styles.loginText}> My favourites</span>
                </Link>
              </li>
              <li className={styles.navItems}>
                <button onClick={handleClick} className={styles.navItemsBtn}>
                  <FontAwesomeIcon icon="fa-regular fa-user" className={styles.navItemsUserIcon} />
                </button>
                {showDropdown && (
                  <ul className={styles.dropdown} onClick={handleClick}>
                    <li className={styles.dropDownListItem}>
                      <Link to="/myAccount">My account</Link>
                    </li>
                    <li className={styles.dropDownListItem}>
                      <button onClick={logoutAndNavigate}>Logout</button>
                    </li>
                  </ul>
                )}
              </li>
            </>
          ) : (
            <>
              <li className={styles.navItems}>
                <Link to="/login">
                  <FontAwesomeIcon icon="fa-arrow-right-to-bracket" />
                  <p className={styles.loginText}>Login</p>
                </Link>
              </li>
              <li className={styles.navItems}>
                <Link to="signup">
                  <FontAwesomeIcon icon="fa-regular fa-user" />
                  <p className={styles.loginText}>Signup</p>
                </Link>
              </li>
            </>
          )}
        </ul>
      </nav>
      <div className={styles.spacer}></div>
    </header>
  );
}
