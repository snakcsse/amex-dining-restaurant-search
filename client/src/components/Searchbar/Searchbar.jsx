import React, { useContext } from 'react';
import styles from './Searchbar.module.css';
import SelectInput from '../SelectInput/SelectInput';
import SliderInput from '../SliderInput/SliderInput';
import { SearchContext } from '../../context/SearchContext';

const Searchbar = () => {
  const {
    selectedArea,
    setSelectedArea,
    selectedCuisineType,
    setSelectedCuisineType,
    selectedRestaurantName,
    setSelectedRestaurantName,
    ratingRange,
    setRatingRange,
    ratingCountRange,
    setRatingCountRange,
    filteredRestaurants,
  } = useContext(SearchContext);

  return (
    <div className={styles.container}>
      <SelectInput
        label="Area"
        fieldName="area"
        filteredRestaurants={filteredRestaurants}
        selectedOptions={selectedArea}
        setSelectedOptions={setSelectedArea}
      />
      <SelectInput
        label="Cuisine"
        fieldName="cuisineType"
        filteredRestaurants={filteredRestaurants}
        selectedOptions={selectedCuisineType}
        setSelectedOptions={setSelectedCuisineType}
      />
      <SelectInput
        label="Restaurant Name"
        fieldName="name"
        filteredRestaurants={filteredRestaurants}
        selectedOptions={selectedRestaurantName}
        setSelectedOptions={setSelectedRestaurantName}
      />
      {/* <SliderInput
        label="Rating"
        min={0}
        max={5}
        step={0.1}
        selectedRange={ratingRange}
        setSelectedRange={setRatingRange}
      />
      <SliderInput
        label="Rating Count"
        min={0}
        max={3000}
        step={1}
        selectedRange={ratingCountRange}
        setSelectedRange={setRatingCountRange}
      /> */}
    </div>
  );
};

export default Searchbar;
