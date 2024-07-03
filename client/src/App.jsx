import React from 'react';
import Navbar from './components/Navbar/Navbar';
import Searchbar from './components/Searchbar/Searchbar';
import ListMap from './components/ListMap/ListMap';

const App = () => {
  return (
    <div style={{ height: '100%' }}>
      <Navbar />
      <Searchbar />
      <ListMap />
    </div>
  );
};

export default App;
