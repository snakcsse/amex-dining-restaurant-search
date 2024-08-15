import React, { useContext, useState } from 'react';
import styles from './Login.module.css';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import Notification from '../Notification/Notification';

const Login = () => {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [notification, setNotification] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      setNotification({
        type: 'success',
        message: 'Login successful! You will be redirected to the homepage shortly.',
      });
      setTimeout(() => {
        navigate('/');
        localStorage.setItem('showUserNavItems', true);
      }, 2500);
    } catch (err) {
      setNotification({ type: 'error', message: `Login failed: ${err.response.data.message}` });
    }
  };

  return (
    <div className={styles.loginContainer}>
      <form onSubmit={handleSubmit} className={styles.formContainer}>
        <div className={styles.firstText}>LOG INTO YOUR ACCOUNT</div>
        <div className={styles.inputContainer}>
          <label htmlFor="loginFormEmail" className={styles.labelText}>
            Email
          </label>
          <input
            id="loginFormEmail"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@example.com"
            className={styles.loginInput}
          ></input>
        </div>

        <div className={styles.inputContainer}>
          <label htmlFor="loginFormPassword" className={styles.labelText}>
            Password
          </label>
          <input
            id="loginFormPassword"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className={styles.loginInput}
          ></input>
        </div>

        <button type="submit" className={styles.loginBtn}>
          Login
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
  );
};

export default Login;
