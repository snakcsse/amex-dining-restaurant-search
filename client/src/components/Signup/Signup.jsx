import React, { useContext, useState } from 'react';
import styles from './Signup.module.css';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Notification from '../Notification/Notification';

const Signup = () => {
  const { signup } = useContext(AuthContext);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [notification, setNotification] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const getFriendlyErrorMessage = (error) => {
      if (error.includes('password: Path `password`')) {
        return 'Invalid Password.';
      }
      if (error.includes('email: Path `email`')) {
        return 'Please provide a valid email address.';
      }
      if (error.includes('duplicate key error')) {
        return 'An account with this email already exists.';
      }
      if (error.includes('name')) {
        return 'A username is required.';
      }
      return 'Please ensure all fields are filled in correctly.';
    };

    try {
      await signup(name, email, password, passwordConfirm);
      setNotification({
        type: 'success',
        message: 'Sign up successfully! You will be redirected to the homepage shortly.',
      });
      setTimeout(() => {
        navigate('/');
        localStorage.setItem('showUserNavItems', true);
      }, 2500);
    } catch (err) {
      console.log(err);
      const errMsg = getFriendlyErrorMessage(err.response.data.message);
      setNotification({ type: 'error', message: `Signup failed: ${errMsg}` });
    }
  };
  return (
    <div className={styles.signupContainer}>
      <form onSubmit={handleSubmit} className={styles.formContainer}>
        <div className={styles.firstText}>SIGN UP</div>
        <div className={styles.inputContainer}>
          <label htmlFor="signupFormName" className={styles.labelText}>
            Username
          </label>
          <input
            id="signupFormName"
            type="text"
            value={name}
            className={styles.signupInput}
            placeholder="Your username"
            onChange={(e) => setName(e.target.value)}
          ></input>
        </div>

        <div className={styles.inputContainer}>
          <label htmlFor="signupFormEmail" className={styles.labelText}>
            Email
          </label>
          <input
            id="signupFormEmail"
            type="email"
            value={email}
            className={styles.signupInput}
            placeholder="name@example.com"
            onChange={(e) => setEmail(e.target.value)}
          ></input>
        </div>

        <div className={styles.inputContainer}>
          <label htmlFor="signupFormPassword" className={styles.labelText}>
            Password
          </label>
          <input
            id="signupFormPassword"
            type="password"
            value={password}
            className={styles.signupInput}
            placeholder="••••••••"
            onChange={(e) => setPassword(e.target.value)}
          ></input>
        </div>

        <div className={styles.inputContainer}>
          <label htmlFor="signupFormPasswordConfirm" className={styles.labelText}>
            Confirm Password
          </label>
          <input
            id="signupFormPasswordConfirm"
            type="password"
            value={passwordConfirm}
            className={styles.signupInput}
            placeholder="••••••••"
            onChange={(e) => setPasswordConfirm(e.target.value)}
          ></input>
        </div>

        <div className={styles.passWordCriteria}>
          * Password must be at least 8 characters long.
        </div>

        <button type="submit" className={styles.signupBtn}>
          Signup
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

export default Signup;
