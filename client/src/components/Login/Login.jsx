import React, { useContext, useState } from 'react';
import styles from './Login.module.css';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import Notification from '../Notification/Notification';
import Modal from '../Modal/Modal';
import modalStyles from '../Modal/Modal.module.css';

const Login = () => {
  const { login, forgotPassword } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [notification, setNotification] = useState(null);
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');

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

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    try {
      await forgotPassword(forgotEmail);
      setNotification({
        type: 'success',
        message: 'Reset password link sent to your email.',
      });
    } catch (err) {
      setNotification({ type: 'error', message: `Email not sent: ${err.response.data.message}` });
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

        <div onClick={() => setShowModal(true)} className={styles.forgotPasswordlink}>
          Forgot password?
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

      {/* Modal for sending reset password link */}
      <Modal show={showModal} onClose={() => setShowModal(false)}>
        <div className={modalStyles.forgotPasswordHeader}>Enter your email to reset password</div>
        <form className={modalStyles.forgotPasswordFormContainer}>
          <input
            type="email"
            className={modalStyles.forgotPasswordInput}
            value={forgotEmail}
            onChange={(e) => setForgotEmail(e.target.value)}
          ></input>
          <button
            onClick={handleForgotPassword}
            type="button"
            className={modalStyles.forgotPasswordSendEmailBtn}
          >
            Send Reset Link
          </button>
        </form>
        {notification && (
          <Notification
            message={notification.message}
            type={notification.type}
            onClose={() => setNotification(null)}
          />
        )}
      </Modal>
    </div>
  );
};

export default Login;
