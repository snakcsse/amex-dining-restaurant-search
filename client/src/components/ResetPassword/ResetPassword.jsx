import React, { useContext, useState } from 'react';
import styles from './ResetPassword.module.css';
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import Notification from '../Notification/Notification';

const ResetPassword = () => {
  const { token } = useParams();
  const { resetPassword } = useContext(AuthContext);
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [notification, setNotification] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await resetPassword(token, password, passwordConfirm);
      setNotification({
        type: 'success',
        message: 'Your password is uploaded! Your will be directed to login page.',
      });
      setTimeout(() => {
        navigate('/login');
      }, 2500);
    } catch (err) {
      setNotification({
        type: 'error',
        message: `Password update failed: ${err.response.data.message}`,
      });
    }
  };

  return (
    <>
      <div className={styles.logoContainer}>
        <img className={styles.logo} src="/img/amexDineLogo.png" alt="Amex Dining Finder Logo" />
        <div className={styles.logoText}>AMEX Dining Restaruant Finder</div>
      </div>
      <div className={styles.resetPasswordContainer}>
        <form onSubmit={handleSubmit} className={styles.formContainer}>
          <div className={styles.firstText}>Enter your new password</div>
          <div className={styles.inputContainer}>
            <label htmlFor="resetPasswordPassword" className={styles.labelText}>
              Password
            </label>
            <input
              id="resetPasswordPassword"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className={styles.resetPasswordInput}
            ></input>
          </div>

          <div className={styles.inputContainer}>
            <label htmlFor="resetPasswordPasswordConfirm" className={styles.labelText}>
              Confirm Password
            </label>
            <input
              id="resetPasswordPasswordConfirm"
              type="password"
              value={passwordConfirm}
              className={styles.resetPasswordInput}
              placeholder="••••••••"
              onChange={(e) => setPasswordConfirm(e.target.value)}
            ></input>
          </div>

          <button type="submit" className={styles.resetPasswordBtn}>
            Reset password
          </button>
        </form>
        {notification && (
          <Notification
            message={notification.message}
            type={notification.type}
            onClose={() => setNotification(null)}
          />
        )}
      </div>
    </>
  );
};

export default ResetPassword;
