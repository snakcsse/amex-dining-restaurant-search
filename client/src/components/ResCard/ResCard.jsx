import React from 'react';
import styles from './ResCard.module.css';

const ResCard = ({ restaurant }) => {
  return (
    <div className={styles.card} id={`resCard-${restaurant._id}`}>
      <img
        src={`http://localhost:3000/${restaurant.googlePhoto}`}
        className={styles.image}
        alt={restaurant.name}
      ></img>
      <div className={styles.description}>
        <h3>
          <a href={restaurant.resPage} target="_blank">
            {/* {restaurant.name} {restaurant.cuisineType} */}
            {restaurant.name} <span className={styles.smallText}>[{restaurant.cuisineType}]</span>
          </a>
        </h3>
        <h6>{restaurant.access}</h6>
        <br></br>
        <h6>{restaurant.catchCopy}</h6>
        <h6>Area: {restaurant.area}</h6>
        <div>
          Google review: {restaurant.googleRating} || 💬 {restaurant.googleUserRatingCount}人
        </div>
      </div>
    </div>
  );
};

export default ResCard;
