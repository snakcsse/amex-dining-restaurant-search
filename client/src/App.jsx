import React from 'react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { SearchProvider } from './context/SearchContext';
import Navbar from './components/Navbar/Navbar';
import Searchbar from './components/Searchbar/Searchbar';
import ListMap from './components/ListMap/ListMap';
import ResCard from './components/ResCard/ResCard';

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

  const resCards = restaurantLists.map((restaurant) => {
    return <ResCard key={restaurant._id} restaurant={restaurant} />;
  });

  const scrollToRestaurant = (restaurantId) => {
    const selectedRestaurant = document.getElementById(`resCard-${restaurantId}`);
    if (selectedRestaurant) {
      selectedRestaurant.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <SearchProvider restaurantLists={restaurantLists}>
      <div style={{ height: '100%' }}>
        <Navbar />
        <Searchbar />
        <ListMap
          resCards={resCards}
          restaurant={restaurantLists}
          scrollToRestaurant={scrollToRestaurant}
        />
      </div>
    </SearchProvider>
  );
};

export default App;
