import React from 'react';
import { useEffect, useState } from 'react';
import styles from './SliderInput.module.css';
import ReactSlider from 'react-slider';

const SliderInput = ({ label, max, min, step, fieldName, filters, setFilters }) => {
  const [showSlider, setShowSlider] = useState(false);

  const handleSliderChange = ([min, max]) => {
    setFilters((prevFilters) => ({ ...prevFilters, [fieldName]: [min, max] }));
  };

  const toggle = () => {
    setShowSlider(!showSlider);
  };

  // useEffect(() => {
  //   if (!effectRun && filteredRestaurants.length > 0) {
  //     console.log('First rangeFilter useEffect runs');
  //     setEffectRun(true);
  //     console.log('this has ended');
  //   }
  // }, [filteredRestaurants]);

  // useEffect(() => {
  //   if (filteredRestaurants.length > 0) {
  //     const otherOptionsChangeRange = filteredRestaurants.map(
  //       (restaurant) => restaurant[fieldName]
  //     );
  //     const otherOptionsChangeMax = Math.max(...otherOptionsChangeRange);
  //     const otherOptionsChangeMin = Math.min(...otherOptionsChangeRange);
  //     setSelectedRange([otherOptionsChangeMin, otherOptionsChangeMax]);
  //   } else if (selectedArea.length === 0) {
  //     setSelectedRange([0, 0]);
  //   }
  // }, [selectedArea, selectedCuisineType, selectedRestaurantName]);

  return (
    <div className={styles.container}>
      <label className={styles.dropdownLabel} onClick={toggle}>
        {label} {showSlider ? '▲' : '▼'}
      </label>
      {showSlider && (
        <>
          <ReactSlider
            className={styles.slider}
            thumbClassName={styles.thumb}
            trackClassName={styles.track}
            max={max}
            min={min}
            step={step}
            defaultValue={[filters[fieldName][0], filters[fieldName][1]]}
            onChange={handleSliderChange} // ReactSlider will automatically pass in [min,max] of the slider value to the function
          />
          <div className={styles.rangeValues}>
            <span>{filters[fieldName][0]}</span>
            <span>{filters[fieldName][1]}</span>
          </div>
        </>
      )}
    </div>
  );
};

export default SliderInput;
