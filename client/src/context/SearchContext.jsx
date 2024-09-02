import { createContext, useEffect, useState } from 'react';
import { useLoadingBar } from './LoadingBarContext';

export const SearchContext = createContext();

export const SearchProvider = ({ children, restaurantLists }) => {
  const [effectRun, setEffectRun] = useState(false);
  const [ratingRange, setRatingRange] = useState([0, 5]);
  const [ratingCountRange, setRatingCountRange] = useState([0, 2000]);
  const loadingBarRef = useLoadingBar();
  const [filters, setFilters] = useState({
    area: [],
    cuisineType: [],
    name: [],
    rating: [0, ratingRange[1]],
    ratingCount: [0, ratingCountRange[1]],
  });
  const [filteredRestaurants, setFilteredRestaurants] = useState(restaurantLists);

  // Function for extracting the options from all restaurants for each filter
  const extractAllOptions = (key) => {
    let options = [];
    const sortedRestaurantLists =
      key === 'area'
        ? [...restaurantLists].sort((a, b) => a.prefCode - b.prefCode)
        : restaurantLists; // for area, sort the selection options based on pref
    sortedRestaurantLists.forEach((restaurant) => {
      options.push(restaurant[key]);
    });
    return [...new Set(options)];
  };

  // Whenever the HomePage is visited, reset the filters and restaurants to the default
  const resetStates = () => {
    // find the maximum rating and ratingCount
    const ratingMax = Math.max(...restaurantLists.map((res) => res.googleRating)); // Math.max doesn't accept a list and we need to use spread operator to convert the array into individual arguments
    const ratingCountMax = Math.max(...restaurantLists.map((res) => res.googleUserRatingCount));
    setRatingRange(ratingMax ? [0, ratingMax] : [0, 5]);
    setRatingCountRange(ratingCountMax ? [0, ratingCountMax] : [0, 2000]);

    // updating filters
    setFilters(() => ({
      area: extractAllOptions('area'),
      cuisineType: extractAllOptions('cuisineType'),
      name: extractAllOptions('name'),
      rating: ratingMax ? [0, ratingMax] : [0, 5], // since state updates in React are asynchronous, latest RatingRange is not reflected so cannot directly use ratingRange[1]
      ratingCount: ratingCountMax ? [0, ratingCountMax] : [0, 2000],
    }));

    setFilteredRestaurants(restaurantLists);
  };

  // Updating filters based on all restaurants from fetched restaurantLists
  // Using useEffect here because even when the restaurantLists is updated after fetching API in App.jsx file, the restaurantLists is paased as prop to SearchContext file. useState will not be run again for prop changes.
  useEffect(() => {
    if (!effectRun && restaurantLists.length > 0) {
      resetStates();

      // turn effect run to true such that these codes only run once
      setEffectRun(true);
    }
  }, [restaurantLists, effectRun]);

  // Filtering restaurants based on the filter options selected by users
  useEffect(() => {
    loadingBarRef.current.continuousStart();

    const filtered = restaurantLists.filter((restaurant) => {
      return (
        (filters.area.length > 0 ? filters.area.includes(restaurant.area) : true) &&
        (filters.cuisineType.length > 0
          ? filters.cuisineType.includes(restaurant.cuisineType)
          : true) &&
        (filters.name.length > 0 ? filters.name.includes(restaurant.name) : true) &&
        restaurant.googleRating >= filters.rating[0] &&
        restaurant.googleRating <= filters.rating[1] &&
        restaurant.googleUserRatingCount >= filters.ratingCount[0] &&
        restaurant.googleUserRatingCount <= filters.ratingCount[1]
      );
    });
    setFilteredRestaurants(filtered);

    loadingBarRef.current.complete();
  }, [filters]);

  return (
    <SearchContext.Provider //.Provider is a component provided when we create a context using .createContext(). The value will be available to all nested components inside this .Provider component
      value={{
        filters,
        setFilters,
        filteredRestaurants,
        setFilteredRestaurants,
        ratingRange,
        ratingCountRange,
        restaurantLists,
        resetStates,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};
