import { useContext, useState } from 'react';
import styles from './ResCard.module.css';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const ResCard = ({ restaurant }) => {
  const { user, setUser } = useContext(AuthContext);
  const [alertVisibility, setAlertVisibility] = useState(false);

  const baseURL = import.meta.env.VITE_BACKEND_HOST_URL || 'http://localhost:3000';

  const handleVisibility = () => {
    setAlertVisibility(true);
    setTimeout(() => setAlertVisibility(false), 2000);
  };

  const Alert = ({ message, visible, color }) => {
    return (
      <div className={`${styles.alert} ${visible ? styles.show : ''} ${styles[color]}`}>
        {message}
      </div>
    );
  };

  const handleAddFavourite = async () => {
    await axios.patch(
      `${baseURL}/api/v1/users/addFavourite`,
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
      `${baseURL}/api/v1/users/removeFavourite`,
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

  const generateStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating); // Number of fully filled stars
    const halfStars = rating % 1 >= 0.5 ? 1 : 0; // Number of half stars
    const emptyStars = 5 - fullStars - halfStars; // Number of empty stars

    for (let i = 0; i < fullStars; i++) {
      stars.push(<FontAwesomeIcon key={`full-${i}`} className={styles.fullStar} icon="fa-star" />); // the star list will contain FontAwesomeIcon JSX elements; no need to wrap in "" otherwise will become a plain text
    }

    if (halfStars === 1) {
      stars.push(
        <FontAwesomeIcon key="half" className={styles.halfStar} icon="fa-star-half-stroke" />
      );
    }

    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <FontAwesomeIcon
          key={`blank-${i}`}
          className={styles.blankStar}
          icon="fa-regular fa-star"
        />
      );
    }

    return stars;
  };

  return (
    <div className={styles.card} id={`resCard-${restaurant._id}`}>
      <div className={styles.imageContainer}>
        <img
          src={`${baseURL}/${restaurant.googlePhoto}`}
          className={styles.image}
          alt={restaurant.name}
          loading="lazy"
        ></img>
      </div>
      <div className={styles.description}>
        <div className={styles.firstLine}>
          <div className={styles.restaurantName}>
            <a href={restaurant.resPage} target="_blank">
              {restaurant.name}
            </a>
          </div>
          {user ? (
            user.favourites.includes(restaurant._id) ? (
              <div className={styles.heartContainer}>
                <button className={styles.resCardBtn} onClick={handleRemoveFavourite}>
                  <FontAwesomeIcon className={styles.solidHeart} icon="fa-heart fa-solid" />
                </button>
                <Alert message="Added to your favourites" visible={alertVisibility} color="green" />
              </div>
            ) : (
              <div className={styles.heartContainer}>
                <button className={styles.resCardBtn} onClick={handleAddFavourite}>
                  <FontAwesomeIcon className={styles.blankHeart} icon="fa-heart fa-regular" />
                </button>
              </div>
            )
          ) : (
            <div className={styles.heartContainer}>
              <button className={styles.resCardBtn} onClick={handleVisibility}>
                <FontAwesomeIcon
                  className={styles.blankHeart}
                  icon="fa-heart fa-regular"
                  color="themeColor"
                />
              </button>
              <Alert
                message="Please login to add your favourites"
                visible={alertVisibility}
                color="themeColor"
              />
            </div>
          )}
        </div>
        <div className={styles.secondText}>
          {restaurant.cuisineType_original} | {restaurant.area}
        </div>
        <div className={styles.divider}></div>
        <div className={styles.catchCopy}>{restaurant.catchCopy}</div>
        <div className={styles.ratingContainer}>
          <div className={styles.starContainer}>{generateStars(restaurant.googleRating)}</div>
          <div className={styles.ratingValue}>{restaurant.googleRating}</div>
          <FontAwesomeIcon className={styles.ratingCountIcon} icon="fa-comments" />
          <div className={styles.ratingCount}> {restaurant.googleUserRatingCount}人</div>
        </div>
        <div className={styles.access}>{restaurant.access}</div>
      </div>
    </div>
  );
};

export default ResCard;
