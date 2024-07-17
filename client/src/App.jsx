import React from 'react';
import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { SearchProvider, SearchContext } from './context/SearchContext';

import Navbar from './components/Navbar/Navbar';
import Searchbar from './components/Searchbar/Searchbar';
import ListMap from './components/ListMap/ListMap';

const App = () => {
  const [restaurantLists, setRestaurantLists] = useState([]);

  useEffect(() => {
    axios
      .get('http://localhost:3000/api/v1/restaurants')
      .then((res) => {
        setRestaurantLists(res.data.data.restaurants);
      })
      .catch((err) => console.log('Error ', err));
  }, []);

  return (
    <SearchProvider restaurantLists={restaurantLists}>
      <div style={{ height: '100%' }}>
        <Navbar />
        <Searchbar />
        <ListMap />
      </div>
    </SearchProvider>
  );
};

export default App;
