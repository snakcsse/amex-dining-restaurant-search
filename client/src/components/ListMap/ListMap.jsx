import React from 'react';
import styles from './ListMap.module.css';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import ResCard from '../ResCard/ResCard';

const ListMap = () => {
  // including mapRef codes to avoid Uncaught Error: Map container is already initialized;  using a ref to store the map instance to ensure that the map is only initialized once and properly cleaned up if the component is unmounted
  const mapRef = React.useRef(null);

  React.useEffect(() => {
    if (mapRef.current === null) {
      mapRef.current = L.map('map').setView([35.66471664294879, 139.72809090890786], 8);

      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(mapRef.current);

      const marker = L.marker([35.66471664294879, 139.72809090890786]).addTo(mapRef.current);
      marker.bindPopup('<b>Hello world!</b><br>I am a popup.').openPopup();
    }

    // Clean up the map when the component unmounts
    return () => {
      if (mapRef.current !== null) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  const resCard = Array.from({ length: 10 }).map((_, i) => {
    return <ResCard key={i} />;
  });

  return (
    <div className={styles.container}>
      <div className={styles.leftSide}>
        <section className={styles.resCardList}>{resCard}</section>
      </div>
      <div className={styles.rightSide}>
        <div id="map" className={styles.map}></div>
      </div>
    </div>
  );
};

export default ListMap;
