import React, { useEffect, useContext, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import ResCard from '../ResCard/ResCard';
import styles from './MyFavourites.module.css';
import axios from 'axios';

const MyFavourites = () => {
  const { user } = useContext(AuthContext);
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    const fetchFavourites = async () => {
      const res = await axios.get('http://localhost:3000/api/v1/users/getFavourites', {
        withCredentials: true,
      });
      setRestaurants(res.data.data.favourites);
    };
    fetchFavourites();
  }, [user]);

  const resCards = restaurants.map((restaurant) => {
    return <ResCard key={restaurant._id} restaurant={restaurant} />;
  });

  return (
    <div>
      <p>My Favourites</p>
      <span className={styles.smallText}>{`${restaurants.length} Restaurants`}</span>
      <br></br>
      <br></br>
      {/* <div className={styles.card} id={`resCard-${restaurants._id}`}>
        <img
          src={`http://localhost:3000/${restaurants.googlePhoto}`}
          className={styles.image}
          alt={restaurants.name}
        ></img>
        <div className={styles.description}>
          <h3>
            <a href={restaurants.resPage} target="_blank">
              {restaurants.name}{' '}
              <span className={styles.smallText}>[{restaurants.cuisineType}]</span>
            </a>
          </h3>
          <h6>{restaurants.access}</h6>
          <br></br>
          <h6>{restaurants.catchCopy}</h6>
          <h6>Area: {restaurants.area}</h6>
          <div>
            Google review: {restaurants.googleRating} || 💬 {restaurants.googleUserRatingCount}人
          </div>
        </div>
      </div> */}
      {resCards}
    </div>
  );
};

export default MyFavourites;
