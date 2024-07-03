import React from 'react';
import styles from './ResCard.module.css';

const ResCard = () => {
  return (
    <div className={styles.card}>
      <img src="../../public/img/yakiniku-test.jpg" className={styles.image}></img>
      <div className={styles.description}>
        <h2>Yakiniku-ten</h2>
        <div>Google rating: ★★★★</div>
        <div>Google comments: 400</div>
        <div>Yelp rating: ★★★★</div>
        <div>Yelp rating: 30</div>
      </div>
    </div>
  );
};

export default ResCard;
