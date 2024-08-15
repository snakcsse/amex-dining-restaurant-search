import React from 'react';
import styles from './Modal.module.css'; // Assuming you're using CSS Modules

const Modal = ({ show, onClose, children }) => {
  if (!show) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <button className={styles.closeButton} onClick={onClose}>
          &times;
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
