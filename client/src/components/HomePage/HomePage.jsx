import React from 'react';
import Searchbar from '../Searchbar/Searchbar';
import ListMap from '../ListMap/ListMap';

const HomePage = () => {
  return (
    <div style={{ height: '100%' }}>
      <Searchbar />
      <ListMap />
    </div>
  );
};

export default HomePage;
