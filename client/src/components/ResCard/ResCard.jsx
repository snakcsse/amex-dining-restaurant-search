import React, { useContext, useState } from 'react';
import styles from './ResCard.module.css';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';

const ResCard = ({ restaurant }) => {
  const { user, setUser } = useContext(AuthContext);
  const [alertVisibility, setAlertVisibility] = useState(false);

  const handleVisibility = () => {
    setAlertVisibility(true);
    setTimeout(() => setAlertVisibility(false), 2000);
  };

  const Alert = ({ message, visible }) => {
    return <div className={`${styles.alert} ${visible ? styles.show : ''}`}>{message}</div>;
  };

  const handleAddFavourite = async () => {
    await axios.patch(
      'http://localhost:3000/api/v1/users/addFavourite',
      { restaurantId: restaurant._id },
      {
        withCredentials: true,
      }
    );
    setUser((prevUser) => ({ ...prevUser, favourites: [...prevUser.favourites, restaurant._id] }));
    handleVisibility();
  };

  const handleRemoveFavourite = async () => {
    await axios.patch(
      'http://localhost:3000/api/v1/users/removeFavourite',
      { restaurantId: restaurant._id },
      {
        withCredentials: true,
      }
    );
    // need to update the user state to reflect the updated favourites of the user immediately
    setUser((prevUser) => ({
      ...prevUser,
      favourites: prevUser.favourites.filter((el) => el !== restaurant._id),
    }));
    handleVisibility();
  };

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
          {user ? (
            user.favourites.includes(restaurant._id) ? (
              <div className={styles.heartContainer}>
                <button onClick={handleRemoveFavourite}>💓</button>
                <Alert message="Added to your favourites" visible={alertVisibility} />
              </div>
            ) : (
              <div className={styles.heartContainer}>
                <button onClick={handleAddFavourite}>🤍</button>
                <Alert message="Removed from your favourites" visible={alertVisibility} />
              </div>
            )
          ) : (
            <div className={styles.heartContainer}>
              <button onClick={handleVisibility}>🤍</button>
              <Alert message="Please login to add your favourites" visible={alertVisibility} />
            </div>
          )}
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
