import { useEffect, useState } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { SearchProvider } from './context/SearchContext';
import { AuthProvider } from './context/AuthContext';
import { LoadingBarProvider } from './context/LoadingBarContext';

import Navbar from './components/Navbar/Navbar';
import HomePage from './components/HomePage/HomePage';
import Login from './components/Login/Login';
import Signup from './components/Signup/Signup';
import MyAccount from './components/MyAccount/MyAccount';
import MyFavourites from './components/MyFavourites/MyFavourites';
import ResetPassword from './components/ResetPassword/ResetPassword';

const App = () => {
  const [restaurantLists, setRestaurantLists] = useState([]);
  const baseURL = import.meta.env.VITE_BACKEND_HOST_URL || 'http://localhost:3000';

  useEffect(() => {
    axios
      .get(`${baseURL}/api/v1/restaurants`)
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
                <Route path="/resetPassword/:token" element={<ResetPassword />} />
              </Routes>
            </div>
          </SearchProvider>
        </LoadingBarProvider>
      </Router>
    </AuthProvider>
  );
};

export default App;
