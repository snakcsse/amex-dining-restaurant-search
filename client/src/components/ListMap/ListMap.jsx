import React from 'react';
import { useEffect, useState, useContext } from 'react';
import styles from './ListMap.module.css';
import L from 'leaflet';
import gsap from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import 'leaflet/dist/leaflet.css';
import ResCard from '../ResCard/ResCard';
import { SearchContext } from '../../context/SearchContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const ListMap = () => {
  const { filteredRestaurants } = useContext(SearchContext);
  const [sortOption, setSortOption] = useState('');
  const [sortedRestaurants, setSortedRestaurants] = useState(filteredRestaurants);
  const [mapToggle, setMapToggle] = useState(false);

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  const toggleMapView = () => {
    setMapToggle((prevMapToggle) => !prevMapToggle);
  };

  // Sort restaurants based on the sort option selected by the user
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

  // When the user selects a restaurant in the map, the corresponding restaurant will be scrolled to view with the below function
  gsap.registerPlugin(ScrollToPlugin);
  const scrollToRestaurant = (restaurantId) => {
    const selectedRestaurant = document.getElementById(`resCard-${restaurantId}`);
    const scrollableContainer = document.getElementById('leftSide');

    if (selectedRestaurant) {
      gsap.to(scrollableContainer, {
        duration: 1, // scrolls the window, duration in seconds
        scrollTo: { y: selectedRestaurant, offsetY: 0 }, // add a small offset from the top to give some space
        ease: 'power2.out', //creates a smooth scroll that decelerates as it reaches the destination
      });
    }
  };

  // Include mapRef to avoid Uncaught Error: Map container is already initialized;  using a ref to store the map instance to ensure that the map is only initialized once and properly cleaned up if the component is unmounted
  const mapRef = React.useRef(null);
  let currentPopup = null;

  // Convert googleUserRatingCount to scale of 2-20 for radius and googleRating to scale of 0.2 - 0.8 for fillOpacity
  function getScaledValue(value, range1, range2) {
    if (value === 0) {
      return 2;
    } else if (value > 3000) {
      return 20;
    } else {
      return ((value - range1[0]) * (range2[1] - range2[0])) / (range1[1] - range1[0]) + range2[0];
    }
  }

  // Create the map
  useEffect(() => {
    if (mapRef.current === null) {
      mapRef.current = L.map('map').setView([35.6812, 139.7671], 6); // Set default view location as Tokyo station

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
          `<a class="${styles.mapPopUpContent}" href=${filteredRestaurants[i].resPage} target="_blank"><div class="${styles.mapPopUpTitle}">${filteredRestaurants[i].name}</div> 
          <div class="${styles.mapPopUpInfo}">Google rating: ${filteredRestaurants[i].googleRating}</div>
          <div class="${styles.mapPopUpInfo}">Rating count: ${filteredRestaurants[i].googleUserRatingCount}</div></a>`, // need to use class instead of className since here it is plain HTML
          { autoPan: false } // Prevent map moving when popup opens
        );

        marker.on('click', function () {
          scrollToRestaurant(filteredRestaurants[i]._id);

          if (currentPopup && currentPopup !== this.getPopup()) {
            currentPopup.close(); // Close the previous popup
          }

          this.getPopup(); // Open the current popup
          currentPopup = this.getPopup();
        });

        marker.on('mouseover', function (e) {
          this.openPopup();
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

  return (
    <div className={styles.container}>
      <div id="leftSide" className={styles.leftSide}>
        <div className={styles.dropDownContainer}>
          <div className={styles.dropdown}>
            <label className={styles.sortLabel} htmlFor="dropdown">
              Sort by
            </label>
            <select
              className={styles.dropDownOptions}
              id="dropdwon"
              value={sortOption}
              onChange={handleSortChange}
            >
              <option value="" disabled>
                Select
              </option>
              <option value="googleRating">Rating</option>
              <option value="googleUserRatingCount">Rating Count</option>
            </select>
          </div>
          <div className={styles.numberOfResults}>
            <span className={styles.boldText}> {filteredRestaurants.length} </span>
            restaurants
          </div>
        </div>
        <section className={styles.resCardList}>{resCards}</section>
      </div>
      <div className={`${styles.rightSide}  ${mapToggle ? styles.show : ''}`}>
        <div id="map" className={styles.map}></div>
      </div>
      <div className={styles.mapListToggle} onClick={toggleMapView}>
        <div className={styles.mapListToggleContent}>
          {mapToggle ? (
            <>
              <FontAwesomeIcon className={styles.mapListToggleIcon} icon="fa-solid fa-bars" />
              <div className={styles.mapListToggleText}>List</div>
            </>
          ) : (
            <>
              <div className={styles.mapListToggleText}>Map</div>
              <FontAwesomeIcon className={styles.mapListToggleIcon} icon="fa-regular fa-map" />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ListMap;
