import React from 'react';
import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { SearchProvider, SearchContext } from './context/SearchContext';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

import { LoadingBarProvider } from './context/LoadingBarContext';

import Navbar from './components/Navbar/Navbar';
import Searchbar from './components/Searchbar/Searchbar';
import ListMap from './components/ListMap/ListMap';
import HomePage from './components/HomePage/HomePage';
import Login from './components/Login/Login';
import Signup from './components/Signup/Signup';
import MyAccount from './components/MyAccount/MyAccount';
import MyFavourites from './components/MyFavourites/MyFavourites';

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
    <AuthProvider>
      <Router>
        <LoadingBarProvider>
          <SearchProvider restaurantLists={restaurantLists}>
            <div style={{ height: '100%' }}>
              <Navbar />
              <Routes>
                <Route exact path="/" element={<HomePage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/myAccount" element={<MyAccount />} />
                <Route path="/myFavourites" element={<MyFavourites />} />
              </Routes>
            </div>
          </SearchProvider>
        </LoadingBarProvider>
      </Router>
    </AuthProvider>
  );
};

export default App;
