import React, { createContext, useEffect, useState } from 'react';

export const SearchContext = createContext();

export const SearchProvider = ({ children, restaurantLists }) => {
  const extractAllOptions = (key) => {
    let options = [];
    restaurantLists.forEach((restaurant) => {
      options.push(restaurant[key]);
    });
    return [...new Set(options)]; // new Set(array) creates a Set object, [...] converts the Set back to an array
  };

  const [selectedArea, setSelectedArea] = useState([]);
  const [selectedCuisineType, setSelectedCuisineType] = useState([]);
  const [selectedRestaurantName, setSelectedRestaurantName] = useState(extractAllOptions([]));
  const [ratingRange, setRatingRange] = useState([0, 5]);
  const [ratingCountRange, setRatingCountRange] = useState([0, 3000]);
  const [filteredRestaurants, setFilteredRestaurants] = useState(restaurantLists);

  const [effectRun, setEffectRun] = useState(false);

  // using useEffect here coz even in App.jsx file, the restaurantLists is updated after fetching API, the restaurantLists is paased as prop to SearchContext file. useState will not be run again for prop changes.
  useEffect(() => {
    if (!effectRun && restaurantLists.length > 0) {
      setSelectedArea(extractAllOptions('area'));
      setSelectedCuisineType(extractAllOptions('cuisineType'));
      setSelectedRestaurantName(extractAllOptions('name'));
      // setFilteredRestaurants(restaurantLists);
      setEffectRun(true);
    }
  }, [restaurantLists, effectRun]);

  // function for SelectInput
  // created a function such that we can apply useEffect for each dependency (i.e. separate selectedArea, selectedCuisineType etc. but not putting them all tgt in a single useEffect), otherwise selectedArea will alwasy be updated first
  // changing checkbox status in each field will trigger this function
  const updateFilteredRes = (selectedOptions, label) => {
    let filtered = restaurantLists;

    // use [] instead of dot notation when referring to label
    const applyFilter = (selectedOptions, label) => {
      if (selectedOptions.length > 0) {
        filtered = filtered.filter((restaurant) => selectedOptions.includes(restaurant[label]));
        return filtered;
      } else {
        // to cater the case when all options are unselected
        filtered = [];
        return filtered;
      }
    };

    applyFilter(selectedOptions, label);
    setFilteredRestaurants(filtered);
  };

  // function for SliderInput
  const updateRangeFilter = ([min, max], label) => {
    let filtered = restaurantLists;

    console.log('1SliderInput function run: ', filtered);
    // console.log('SliderInput function run: ', typeof min);
    const applyRangeFilter = ([min, max], label) => {
      filtered = filtered.filter((restaurant) => {
        return restaurant[label] >= min && restaurant[label] <= max;
      });
      console.log('3SliderInput function run: ', filtered);
      return filtered;
    };

    applyRangeFilter([min, max], label);
    setFilteredRestaurants(filtered);
    console.log('4SliderInput function run: ', filteredRestaurants);
  };

  // ---------- useEffect ------------
  useEffect(() => {
    setFilteredRestaurants(restaurantLists);
  }, [restaurantLists]);

  useEffect(() => {
    updateFilteredRes(selectedArea, 'area');
  }, [selectedArea]);

  useEffect(() => {
    updateFilteredRes(selectedCuisineType, 'cuisineType');
  }, [selectedCuisineType]);

  useEffect(() => {
    updateFilteredRes(selectedRestaurantName, 'name');
  }, [selectedRestaurantName]);

  useEffect(() => {
    updateRangeFilter(ratingRange, 'googleRating');
  }, [ratingRange]);

  useEffect(() => {
    updateRangeFilter(ratingCountRange, 'googleUserRatingCount');
  }, [ratingCountRange]);
  // applyRangeFilter(ratingRange, 'googleRating');  //TODO
  // applyRangeFilter(ratingCountRange, 'googleUserRatingCount');

  // ---------------NOT USING THE BELOW coz all selectedOptions put into a single dependency -> then selectedArea will always update first which makes cuisineType and restaruant name checkbox can be updated)
  // useEffect(() => {
  //   if (!effectRun && restaurantLists.length > 0) {
  //     setSelectedArea(extractAllOptions('area'));
  //     setSelectedCuisineType(extractAllOptions('cuisineType'));
  //     setSelectedRestaurantName(extractAllOptions('name'));
  //     // setFilteredRestaurants(restaurantLists);
  //     setEffectRun(true);
  //   }
  // }, [restaurantLists, effectRun]);

  // useEffect(() => {
  //   let filtered = restaurantLists;

  //   // use [] instead of dot notation when referring to label
  //   const applyFilter = (selectedOptions, label) => {
  //     if (selectedOptions.length > 0) {
  //       filtered = filtered.filter((restaurant) => selectedOptions.includes(restaurant[label]));
  //     }
  //     return filtered;
  //   };

  //   const applyRangeFilter = ([min, max], label) => {
  //     filtered = filtered.filter((restaurant) => {
  //       restaurant.label >= min && restaurant[label] <= max;
  //     });
  //     return filtered;
  //   };

  //   applyFilter(selectedArea, 'area');
  //   applyFilter(selectedCuisineType, 'cuisineType');
  //   applyFilter(selectedRestaurantName, 'name');

  //   // applyRangeFilter(ratingRange, 'googleRating');  //TODO
  //   // applyRangeFilter(ratingCountRange, 'googleUserRatingCount');

  //   setFilteredRestaurants(filtered);
  // }, [
  //   selectedArea,
  //   selectedCuisineType,
  //   selectedRestaurantName,
  //   ratingRange,
  //   ratingCountRange,
  //   restaurantLists,
  // ]);

  // console.log(filteredRestaurants);
  return (
    <SearchContext.Provider //.Provider is a component provided when we create a context using .createContext(). The value will be available to all nested components inside this .Provider component
      value={{
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
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};
