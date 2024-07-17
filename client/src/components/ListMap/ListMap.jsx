import React from 'react';
import { useEffect, useState, useContext } from 'react';
import styles from './ListMap.module.css';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import ResCard from '../ResCard/ResCard';
import { SearchContext } from '../../context/SearchContext';

const ListMap = () => {
  // including mapRef codes to avoid Uncaught Error: Map container is already initialized;  using a ref to store the map instance to ensure that the map is only initialized once and properly cleaned up if the component is unmounted
  // useEffect(() => {
  //   if (filteredRestaurants.length > 0 && filteredRestaurants[0].location) {
  //     console.log(filteredRestaurants[0].location);
  //   }
  // }, [filteredRestaurants]);

  const { filteredRestaurants } = useContext(SearchContext);
  const [sortOption, setSortOption] = useState('');
  const [sortedRestaurants, setSortedRestaurants] = useState(filteredRestaurants);

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  useEffect(() => {
    if (sortOption !== '') {
      setSortedRestaurants(
        filteredRestaurants.slice().sort((a, b) => b[sortOption] - a[sortOption])
      );
    } else {
      setSortedRestaurants(filteredRestaurants);
    }
  }, [sortOption, filteredRestaurants]);

  const resCards = sortedRestaurants.map((restaurant) => {
    return <ResCard key={restaurant._id} restaurant={restaurant} />;
  });

  const scrollToRestaurant = (restaurantId) => {
    const selectedRestaurant = document.getElementById(`resCard-${restaurantId}`);
    if (selectedRestaurant) {
      selectedRestaurant.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const mapRef = React.useRef(null);

  // convert googleUserRatingCount to scale of 2-20 for radius and googleRating to scale of 0.2 - 0.8 for fillOpacity
  function getScaledValue(value, range1, range2) {
    if (value === 0) {
      return 2;
    } else if (value > 3000) {
      return 20;
    } else {
      return ((value - range1[0]) * (range2[1] - range2[0])) / (range1[1] - range1[0]) + range2[0];
    }
  }

  useEffect(() => {
    if (mapRef.current === null) {
      mapRef.current = L.map('map').setView([35.6812, 139.7671], 6); // set default view location as Tokyo station

      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(mapRef.current);

      for (let i = 0; i < filteredRestaurants.length; i++) {
        const marker = L.circleMarker(
          [
            filteredRestaurants[i].location.coordinates[0],
            filteredRestaurants[i].location.coordinates[1],
          ],
          {
            radius: getScaledValue(
              filteredRestaurants[i].googleUserRatingCount,
              [0, 1000],
              [2, 20]
            ),
            weight: 1,
            fillOpacity: getScaledValue(filteredRestaurants[i].googleRating, [0, 5], [0.2, 0.7]),
          }
        ).addTo(mapRef.current);
        marker.bindPopup(
          `<b>${filteredRestaurants[i].name}</b><br>Google rating: ${filteredRestaurants[i].googleRating}`
        );
        marker.on('click', () => {
          scrollToRestaurant(filteredRestaurants[i]._id);
        });
      }
    }

    // Clean up the map when the component unmounts
    return () => {
      if (mapRef.current !== null) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [filteredRestaurants]);

  // const resCard = Array.from({ length: 10 }).map((_, i) => {
  //   return <ResCard key={i} />;
  // });
  // const resCard = filteredRestaurantsLists.map((restaurant, index) => {
  //   return <ResCard key={index} restaurant={restaurant} />;
  // });

  return (
    <div className={styles.container}>
      <div className={styles.leftSide}>
        <div className={styles.dropdown}>
          <label htmlFor="dropdown">Sort by</label>
          <select id="dropdwon" value={sortOption} onChange={handleSortChange}>
            <option value="" disabled>
              Select ...
            </option>
            <option value="googleRating">Rating</option>
            <option value="googleUserRatingCount">Rating Count</option>
          </select>
        </div>
        <section className={styles.resCardList}>{resCards}</section>
      </div>
      <div className={styles.rightSide}>
        <div id="map" className={styles.map}></div>
      </div>
    </div>
  );
};

export default ListMap;
