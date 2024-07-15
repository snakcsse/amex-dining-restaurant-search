import React from 'react';
import { useEffect, useState } from 'react';
import styles from './ListMap.module.css';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import ResCard from '../ResCard/ResCard';
import axios from 'axios';

const ListMap = (props) => {
  // including mapRef codes to avoid Uncaught Error: Map container is already initialized;  using a ref to store the map instance to ensure that the map is only initialized once and properly cleaned up if the component is unmounted
  // useEffect(() => {
  //   if (props.restaurant.length > 0 && props.restaurant[0].location) {
  //     console.log(props.restaurant[0].location);
  //   }
  // }, [props.restaurant]);

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

  React.useEffect(() => {
    if (mapRef.current === null) {
      mapRef.current = L.map('map').setView([35.6812, 139.7671], 6); // set default view location as Tokyo station

      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(mapRef.current);

      for (let i = 0; i < props.restaurant.length; i++) {
        const marker = L.circleMarker(
          [
            props.restaurant[i].location.coordinates[0],
            props.restaurant[i].location.coordinates[1],
          ],
          {
            radius: getScaledValue(props.restaurant[i].googleUserRatingCount, [0, 1000], [2, 20]),
            weight: 1,
            fillOpacity: getScaledValue(props.restaurant[i].googleRating, [0, 5], [0.2, 0.7]),
          }
        ).addTo(mapRef.current);
        marker.bindPopup(
          `<b>${props.restaurant[i].name}</b><br>Google rating: ${props.restaurant[i].googleRating}`
        );
        marker.on('click', () => {
          props.scrollToRestaurant(props.restaurant[i]._id);
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
  }, [props.restaurant]);

  // const resCard = Array.from({ length: 10 }).map((_, i) => {
  //   return <ResCard key={i} />;
  // });
  // const resCard = props.restaurantLists.map((restaurant, index) => {
  //   return <ResCard key={index} restaurant={restaurant} />;
  // });

  return (
    <div className={styles.container}>
      <div className={styles.leftSide}>
        <section className={styles.resCardList}>{props.resCards}</section>
      </div>
      <div className={styles.rightSide}>
        <div id="map" className={styles.map}></div>
      </div>
    </div>
  );
};

export default ListMap;
