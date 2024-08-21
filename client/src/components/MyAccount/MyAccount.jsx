import React, { useState, useContext } from 'react';
import styles from './MyAccount.module.css';
import Notification from '../Notification/Notification';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const MyAccount = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [passwordCurrent, setPasswordCurrent] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [notification, setNotification] = useState(null);
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const baseURL = import.meta.env.VITE_BACKEND_HOST_URL || 'http://localhost:3000';

  const handleUserInfoSubmit = async (e) => {
    e.preventDefault();

    let updateInfo = {};
    if (name === '' && email === '') {
      setNotification({ type: 'error', message: 'Please enter a name or email' });
      return;
    } else if (name === '') {
      updateInfo = { email };
    } else if (email === '') {
      updateInfo = { name };
    } else if (name !== '' && email !== '') {
      updateInfo = { name, email };
    }

    try {
      await axios.patch(`${baseURL}/api/v1/users/updateMe`, updateInfo, {
        withCredentials: true,
      });
      setNotification({ type: 'success', message: 'Account settings updated successfully' });
    } catch (err) {
      setNotification({
        type: 'error',
        message: `Error updating account settings: ${err.response.data.message}`,
      });
    }
  };

  const deleteMe = async (e) => {
    e.preventDefault();
    try {
      await axios.delete(`${baseURL}/api/v1/users/deleteMe`, { withCredentials: true });
      setNotification({
        type: 'success',
        message: 'Account deleted successfully. You will be redirected to homepage.',
      });
      setUser(null);
      setTimeout(() => navigate('/'), 2500);
    } catch (err) {
      setNotification({
        type: 'error',
        message: `Error updating account settings: ${err.response.message}`,
      });
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();

    if (passwordCurrent === '' || password === '' || passwordConfirm === '') {
      setNotification({ type: 'error', message: 'Please enter all fields' });
      return;
    }

    try {
      await axios.patch(
        `${baseURL}/api/v1/users/updateMyPassword`,
        { passwordCurrent, password, passwordConfirm },
        {
          withCredentials: true,
        }
      );
      setNotification({ type: 'success', message: 'Password updated successfully' });
    } catch (err) {
      setNotification({
        type: 'error',
        message: `${err.response.data.message}`,
      });
    }
  };

  return (
    <>
      <div className={styles.myAccountPageContainer}>
        <form className={styles.formContainer} onSubmit={handleUserInfoSubmit}>
          <div className={styles.firstText}>YOUR ACCOUNT SETTINGS</div>
          <div className={styles.inputContainer}>
            <label htmlFor="name" className={styles.labelText}>
              Name
              <input
                type="text"
                value={name}
                className={styles.myAccountInput}
                name="name"
                placeholder={user ? user.name : ''}
                onChange={(e) => setName(e.target.value)}
              ></input>
            </label>
            <label htmlFor="email" className={styles.labelText}>
              Email
              <input
                type="text"
                value={email}
                className={styles.myAccountInput}
                name="email"
                placeholder={user ? user.email : ''}
                onChange={(e) => setEmail(e.target.value)}
              ></input>
            </label>
          </div>
          <div className={styles.userInfoBtnsContainer}>
            <button type="submit" className={styles.userInfoBtns}>
              Update
            </button>
            <button type="button" onClick={deleteMe} className={styles.deleteAccountBtns}>
              Delete Account
            </button>
          </div>
        </form>

        <br></br>

        <form className={styles.formContainer} onSubmit={handlePasswordUpdate}>
          <div className={styles.firstText}>PASSWORD CHANGE</div>
          <div className={styles.inputContainer}>
            <label htmlFor="passwordCurrent" className={styles.labelText}>
              passwordCurrent
              <input
                type="password"
                value={passwordCurrent}
                className={styles.myAccountInput}
                name="passwordCurrent"
                placeholder="••••••••"
                onChange={(e) => setPasswordCurrent(e.target.value)}
              ></input>
            </label>
            <label htmlFor="password" className={styles.labelText}>
              Password
              <input
                type="password"
                value={password}
                className={styles.myAccountInput}
                name="password"
                placeholder="••••••••"
                onChange={(e) => setPassword(e.target.value)}
              ></input>
            </label>
            <label htmlFor="passwordConfirm" className={styles.labelText}>
              PasswordConfirm
              <input
                type="password"
                value={passwordConfirm}
                className={styles.myAccountInput}
                name="passwordConfirm"
                placeholder="••••••••"
                onChange={(e) => setPasswordConfirm(e.target.value)}
              ></input>
            </label>
            {/* <div className={styles.passwordUpdateBtn}> */}
            <button type="submit" className={styles.passwordUpdateBtn}>
              Update Password
            </button>
            {/* </div> */}
          </div>
        </form>
      </div>
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
    </>
  );
};

export default MyAccount;
