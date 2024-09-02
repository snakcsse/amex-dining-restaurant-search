import { useContext, useEffect } from 'react';
import Searchbar from '../Searchbar/Searchbar';
import ListMap from '../ListMap/ListMap';
import { SearchContext } from '../../context/SearchContext';

const HomePage = () => {
  const { resetStates } = useContext(SearchContext);

  useEffect(() => {
    resetStates();
  }, []);

  return (
    <div style={{ height: '100%' }}>
      <Searchbar />
      <ListMap />
    </div>
  );
};

export default HomePage;
