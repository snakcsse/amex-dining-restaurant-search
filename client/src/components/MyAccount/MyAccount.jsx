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
      await axios.patch('http://localhost:3000/api/v1/users/updateMe', updateInfo, {
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
      await axios.delete('http://localhost:3000/api/v1/users/deleteMe', { withCredentials: true });
      setNotification({ type: 'success', message: 'Account deleted successfully' });
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
        'http://localhost:3000/api/v1/users/updateMyPassword',
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
      <div>
        <p>YOUR ACCOUNT SETTINGS</p>
        <form className={styles.userInfoSetting} onSubmit={handleUserInfoSubmit}>
          <label htmlFor="name">
            Name
            <input
              type="text"
              value={name}
              name="name"
              onChange={(e) => setName(e.target.value)}
            ></input>
          </label>
          <label htmlFor="email">
            Email
            <input
              type="text"
              value={email}
              name="email"
              onChange={(e) => setEmail(e.target.value)}
            ></input>
          </label>
          <div className={styles.userInfoBtns}>
            <button type="submit">Update</button>
            <button type="button" onClick={deleteMe}>
              Delete Account
            </button>
          </div>
        </form>
        <br></br>
        <p>PASSWORD CHANGE</p>
        <form className={styles.userPasswordUpdate} onSubmit={handlePasswordUpdate}>
          <label htmlFor="passwordCurrent">
            passwordCurrent
            <input
              type="password"
              value={passwordCurrent}
              name="passwordCurrent"
              onChange={(e) => setPasswordCurrent(e.target.value)}
            ></input>
          </label>
          <label htmlFor="password">
            Password
            <input
              type="password"
              value={password}
              name="password"
              onChange={(e) => setPassword(e.target.value)}
            ></input>
          </label>
          <label htmlFor="passwordConfirm">
            PasswordConfirm
            <input
              type="password"
              value={passwordConfirm}
              name="passwordConfirm"
              onChange={(e) => setPasswordConfirm(e.target.value)}
            ></input>
          </label>
          <div className={styles.passwordUpdateBtn}>
            <button type="submit">Update Password</button>
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
