import { useEffect, useContext, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import ResCard from '../ResCard/ResCard';
import styles from './MyFavourites.module.css';
import axios from 'axios';

const MyFavourites = () => {
  const { user } = useContext(AuthContext);
  const [restaurants, setRestaurants] = useState([]);
  const baseURL = import.meta.env.VITE_BACKEND_HOST_URL || 'http://localhost:3000';

  useEffect(() => {
    const fetchFavourites = async () => {
      const res = await axios.get(`${baseURL}/api/v1/users/getFavourites`, {
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
    <div className={styles.container}>
      <div className={styles.title}>My Favourites</div>
      <div className={styles.subInfo}>{`${restaurants.length} Restaurants`}</div>
      <div className={styles.favouriteResContainer}>{resCards}</div>
    </div>
  );
};

export default MyFavourites;
