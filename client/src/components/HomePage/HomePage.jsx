import React from 'react';
import Searchbar from '../Searchbar/Searchbar';
import ListMap from '../ListMap/ListMap';

const HomePage = () => {
  return (
    // TODO: need to add style={{height: '100%'}} maybe
    <div style={{ height: '100%' }}>
      <Searchbar />
      <ListMap />
    </div>
  );
};

export default HomePage;
