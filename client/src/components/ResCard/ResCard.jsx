import React from 'react';
import styles from './ResCard.module.css';

const ResCard = (props) => {
  return (
    <div className={styles.card} id={`resCard-${props.restaurant._id}`}>
      <img
        src={`http://localhost:3000/${props.restaurant.googlePhoto}`}
        className={styles.image}
        alt={props.restaurant.name}
      ></img>
      <div className={styles.description}>
        <h3>
          <a href={props.restaurant.resPage} target="_blank">
            {/* {props.restaurant.name} {props.restaurant.cuisineType} */}
            {props.restaurant.name}{' '}
            <span className={styles.smallText}>[{props.restaurant.cuisineType}]</span>
          </a>
        </h3>
        <div>Area: {props.restaurant.area}</div>
        <div>Google rating: {props.restaurant.googleRating}</div>
        <div>Google comments: {props.restaurant.googleUserRatingCount}</div>
      </div>
    </div>
  );
};

export default ResCard;
