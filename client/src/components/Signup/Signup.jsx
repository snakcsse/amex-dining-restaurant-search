import React, { useContext, useState } from 'react';
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
    try {
      console.log(email);
      await signup(name, email, password, passwordConfirm);
      setNotification({
        type: 'success',
        message: 'Sign up successfully! You will be redirected to the homepage shortly.',
      });
      setTimeout(() => navigate('/'), 2500);
    } catch (err) {
      console.log(err);
      setNotification({ type: 'error', message: `Signup failed: ${err.response.data.message}` });
    }
  };
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={name}
          placeholder="Name"
          onChange={(e) => setName(e.target.value)}
        ></input>
        <input
          type="email"
          value={email}
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        ></input>
        <input
          type="password"
          value={password}
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        ></input>
        <input
          type="password"
          value={passwordConfirm}
          placeholder="Confirm password"
          onChange={(e) => setPasswordConfirm(e.target.value)}
        ></input>
        <button type="submit">Signup</button>
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
