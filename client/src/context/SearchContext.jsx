import React, { createContext, useEffect, useState } from 'react';
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

  const extractAllOptions = (key) => {
    let options = [];
    const sortedRestaurantLists =
      key === 'area'
        ? [...restaurantLists].sort((a, b) => a.prefCode - b.prefCode)
        : restaurantLists; // for area, sort the selection options based on pref
    sortedRestaurantLists.forEach((restaurant) => {
      options.push(restaurant[key]);
    });
    return [...new Set(options)]; // new Set(array) creates a Set object, [...] converts the Set back to an array
  };

  // using useEffect here coz even in App.jsx file, the restaurantLists is updated after fetching API, the restaurantLists is paased as prop to SearchContext file. useState will not be run again for prop changes.
  useEffect(() => {
    if (!effectRun && restaurantLists.length > 0) {
      // find the maximum rating and ratingCount (min is set to 0 which is visiually more comfortable)
      const ratingMax = Math.max(...restaurantLists.map((res) => res.googleRating)); // Math.max doesn't accept a list and we need to use spread operator to convert the array into individual arguments
      const ratingCountMax = Math.max(...restaurantLists.map((res) => res.googleUserRatingCount));
      setRatingRange(ratingMax ? [0, ratingMax] : [0, 5]);
      setRatingCountRange(ratingCountMax ? [0, ratingCountMax] : [0, 2000]);

      // updating filters
      setFilters((prevFilters) => ({
        ...prevFilters,
        area: extractAllOptions('area'),
        cuisineType: extractAllOptions('cuisineType'),
        name: extractAllOptions('name'),
        rating: ratingMax ? [0, ratingMax] : [0, 5], // since state updates in React are asynchronous, latest RatingRange is not reflected so cannot directly use ratingRange[1]
        ratingCount: ratingCountMax ? [0, ratingCountMax] : [0, 2000],
      }));

      setFilteredRestaurants(restaurantLists);

      // turn effect run to true such that these codes only run once
      setEffectRun(true);
    }
  }, [restaurantLists, effectRun]);

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
    console.log('----', filtered);
    setFilteredRestaurants(filtered);

    loadingBarRef.current.complete();
  }, [filters]);

  // // const [selectedArea, setSelectedArea] = useState([]);
  // //const [selectedCuisineType, setSelectedCuisineType] = useState([]);
  // //const [selectedRestaurantName, setSelectedRestaurantName] = useState([]);
  // //const [ratingRange, setRatingRange] = useState([0, 5]);
  // //const [ratingCountRange, setRatingCountRange] = useState([0, 3000]);

  // //using useEffect here coz even in App.jsx file, the restaurantLists is updated after fetching API, the restaurantLists is paased as prop to SearchContext file. useState will not be run again for prop changes.
  // //useEffect(() => {
  // // if (!effectRun && restaurantLists.length > 0) {
  // //    setSelectedArea(extractAllOptions('area'));
  // //    setSelectedCuisineType(extractAllOptions('cuisineType'));
  // //    setSelectedRestaurantName(extractAllOptions('name'));
  // //    // setFilteredRestaurants(restaurantLists);
  // //    setEffectRun(true);
  // //  }
  // //}, [restaurantLists, effectRun]);

  // function for SelectInput
  // created a function such that we can apply useEffect for each dependency (i.e. separate selectedArea, selectedCuisineType etc. but not putting them all tgt in a single useEffect), otherwise selectedArea will alwasy be updated first
  // changing checkbox status in each field will trigger this function
  // const updateFilteredRes = (selectedOptions, label) => {
  //   let filtered = restaurantLists;

  //   // use [] instead of dot notation when referring to label
  //   const applyFilter = (selectedOptions, label) => {
  //     if (selectedOptions.length > 0) {
  //       filtered = filtered.filter((restaurant) => selectedOptions.includes(restaurant[label]));
  //       return filtered;
  //     } else {
  //       // to cater the case when all options are unselected
  //       filtered = [];
  //       return filtered;
  //     }
  //   };

  //   applyFilter(selectedOptions, label);
  //   setFilteredRestaurants(filtered);
  // };

  // // function for SliderInput
  // const updateRangeFilter = ([min, max], label) => {
  //   let filtered = restaurantLists;

  //   // console.log('1SliderInput function run: ', filtered);
  //   // console.log('SliderInput function run: ', typeof min);
  //   const applyRangeFilter = ([min, max], label) => {
  //     filtered = filtered.filter((restaurant) => {
  //       return restaurant[label] >= min && restaurant[label] <= max;
  //     });
  //     // console.log('3SliderInput function run: ', filtered);
  //     return filtered;
  //   };

  //   applyRangeFilter([min, max], label);
  //   setFilteredRestaurants(filtered);
  //   // console.log('4SliderInput function run: ', filteredRestaurants);
  // };

  // ---------- useEffect ------------
  // useEffect(() => {
  //   setFilteredRestaurants(restaurantLists);
  // }, [restaurantLists]);

  // useEffect(() => {
  //   updateFilteredRes(selectedArea, 'area');
  // }, [selectedArea]);

  // useEffect(() => {
  //   updateFilteredRes(selectedCuisineType, 'cuisineType');
  // }, [selectedCuisineType]);

  // useEffect(() => {
  //   updateFilteredRes(selectedRestaurantName, 'name');
  // }, [selectedRestaurantName]);

  // useEffect(() => {
  //   updateRangeFilter(ratingRange, 'googleRating');
  // }, [ratingRange]);

  // useEffect(() => {
  //   updateRangeFilter(ratingCountRange, 'googleUserRatingCount');
  // }, [ratingCountRange]);

  return (
    <SearchContext.Provider //.Provider is a component provided when we create a context using .createContext(). The value will be available to all nested components inside this .Provider component
      value={{
        filters,
        setFilters,
        filteredRestaurants,
        setFilteredRestaurants,
        ratingRange,
        ratingCountRange,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};

// useEffect(() => {
//   console.log(selectedArea);
//   console.log(prevSelectedAreaRef.current);
//   if (
//     filteredRestaurants.length > 0 &&
//     prevSelectedAreaRef.current === selectedArea &&
//     prevSelectedCusineTypeRef.current === selectedCuisineType &&
//     prevSelectedRestaurantNameRef.current === selectedRestaurantName
//   ) {
//     console.log('rangeFilter useEffect executed if statement');
//     updateRangeFilter(ratingRange, 'googleRating');
//   }

//   console.log(prevSelectedAreaRef);
//   console.log('rangeFilter useEffect skipped if statement');
//   prevSelectedAreaRef.current = selectedArea;
//   prevSelectedCusineTypeRef.current = selectedCuisineType;
//   prevSelectedRestaurantNameRef.current = selectedRestaurantName;
// }, [ratingRange, selectedArea, selectedCuisineType, selectedRestaurantName]);
