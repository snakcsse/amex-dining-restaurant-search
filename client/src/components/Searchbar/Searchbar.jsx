import React, { useContext } from 'react';
import styles from './Searchbar.module.css';
import SelectInput from '../SelectInput/SelectInput';
import SliderInput from '../SliderInput/SliderInput';
import { SearchContext } from '../../context/SearchContext';

const Searchbar = () => {
  const {
    filters,
    setFilters,
    filteredRestaurants,
    ratingRange,
    ratingCountRange,
    restaurantLists,
  } = useContext(SearchContext);

  return (
    <div className={styles.container}>
      <SelectInput
        label="Area"
        fieldName="area"
        filteredRestaurants={filteredRestaurants}
        filters={filters}
        setFilters={setFilters}
        restaurantLists={restaurantLists}
      />
      <SelectInput
        label="Cuisine"
        fieldName="cuisineType"
        filteredRestaurants={filteredRestaurants}
        filters={filters}
        setFilters={setFilters}
        restaurantLists={restaurantLists}
      />
      <SelectInput
        label="Restaurant Name"
        fieldName="name"
        filteredRestaurants={filteredRestaurants}
        filters={filters}
        setFilters={setFilters}
        restaurantLists={restaurantLists}
      />
      <SliderInput
        label="Rating"
        fieldName="rating"
        min={ratingRange[0]}
        max={ratingRange[1]}
        step={0.1}
        filters={filters}
        setFilters={setFilters}
      />
      <SliderInput
        label="Rating Count"
        fieldName="ratingCount"
        min={ratingCountRange[0]}
        max={ratingCountRange[1]}
        step={1}
        filters={filters}
        setFilters={setFilters}
      />
    </div>
  );
};

export default Searchbar;
