import React, { useEffect } from 'react';
import styles from './Notification.module.css';

const Notification = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 2500);

    // Clear the timer if the component is unmounted
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`${styles.notification} ${styles[type]}`}>
      <span className={styles.message}>{message}</span>
      <button className={styles.closeBtn} onClick={onClose}>
        x
      </button>
    </div>
  );
};

export default Notification;
